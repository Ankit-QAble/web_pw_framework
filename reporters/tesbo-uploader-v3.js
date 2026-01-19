const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { FormData, File, fetch } = require('undici');

class TesboUploaderV3 {
  constructor(options = {}) {
    this.apiKey = options.apiKey;
    this.apiKeyEnv = options.apiKeyEnv || 'TESBO_API_KEY';
    this.reportingPortalUrlEnv = options.reportingPortalUrlEnv || 'TESBO_REPORTING_PORTAL_URL';
    this.reportingPortalUrl = options.reportingPortalUrl || options.baseUrl || 'https://app.tesbo.io/api';
    this.runTitle = options.runTitle;
    this.jsonPath = options.jsonPath || 'test-results.json';
    this.concurrency = Number(options.concurrency || process.env.TESBO_UPLOAD_CONCURRENCY) || 20;

    this.expectedTestCount = 0;
    this.startedAt = null;
    this.startedAtFromReport = null;
    this.runPromise = null;
    this.uploadedStatusCounts = { PASSED: 0, FAILED: 0, SKIPPED: 0 };
    this._baseUrlInfoLogged = false;
  }

  onBegin() {
    this.startedAt = new Date();
  }

  async onEnd() {
    const reportPath = this._resolveReportPath();
    const report = await this._readJsonReport(reportPath);
    if (!report) {
      console.warn(`[tesbo-uploader-v3] ⚠️  Skipping upload: cannot read report at ${reportPath}`);
      return;
    }

    const tests = this._extractJsonTests(report);
    this.expectedTestCount = tests.length;
    this.startedAtFromReport = this._earliestStart(tests) || this.startedAt;

    if (!tests.length) {
      console.log('[tesbo-uploader-v3] No tests found in report; nothing to upload.');
      return;
    }

    await this._ensureRun(report);
    const runId = await this.runPromise;
    if (!runId) {
      console.warn('[tesbo-uploader-v3] ⚠️  Run was not created; skipping uploads.');
      return;
    }

    console.log(`[tesbo-uploader-v3] Uploading ${tests.length} test(s) from ${reportPath} with concurrency ${this.concurrency}`);
    await this._uploadAllJsonTests(runId, tests, report.config);

    await this._completeRun();
  }

  _resolveReportPath() {
    return path.isAbsolute(this.jsonPath)
      ? this.jsonPath
      : path.join(process.cwd(), this.jsonPath);
  }

  async _readJsonReport(reportPath) {
    const exists = await this._fileExists(reportPath);
    if (!exists) return null;
    try {
      const raw = await fs.promises.readFile(reportPath, 'utf-8');
      return JSON.parse(raw);
    } catch (err) {
      console.warn('[tesbo-uploader-v3] ⚠️  Failed to parse JSON report:', err?.message || err);
      return null;
    }
  }

  async _ensureRun(report) {
    if (this.runPromise) return this.runPromise;
    this.runPromise = this._createRun(report);
    return this.runPromise;
  }

  async _createRun(report) {
    const apiKey = this._resolveApiKey();
    if (!apiKey) {
      console.warn(`[tesbo-uploader-v3] ❌ Skipping run creation: missing apiKey and env ${this.apiKeyEnv}`);
      return null;
    }

    const baseUrl = this._resolveBaseUrl();
    const url = `${baseUrl}/ingest/playwright/runs`;
    const payload = this._clean({
      name: this._resolveRunTitle(),
      expectedTestCount: this.expectedTestCount || undefined,
      branchName: process.env.GITHUB_REF_NAME || process.env.CI_COMMIT_REF_NAME,
      pullRequest: process.env.GITHUB_PR_NUMBER || process.env.CI_MERGE_REQUEST_IID,
      commitAuthor: process.env.GITHUB_ACTOR || process.env.CI_COMMIT_AUTHOR,
      githubRunId: process.env.GITHUB_RUN_ID || process.env.CI_PIPELINE_ID,
      startedAt: this.startedAtFromReport ? new Date(this.startedAtFromReport).toISOString() : undefined
    });

    try {
      console.log(`[tesbo-uploader-v3] Creating run at ${url} with payload:`, payload);
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': apiKey
        },
        body: JSON.stringify(payload)
      });

      const body = await res.text();
      const requestId = res.headers.get('x-request-id') || res.headers.get('x-correlation-id');
      console.log(`[tesbo-uploader-v3] Run create response status: ${res.status} ${res.statusText}`);
      if (requestId) console.log(`[tesbo-uploader-v3] Run create request id: ${requestId}`);
      console.log(`[tesbo-uploader-v3] Run create response body: ${body}`);

      if (!res.ok) {
        console.error(`[tesbo-uploader-v3] ❌ Run creation failed (${res.status} ${res.statusText}): ${body}`);
        return null;
      }

      const parsed = this._safeJson(body);
      if (parsed) console.log('[tesbo-uploader-v3] Run create parsed response:', parsed);
      const runId = parsed?.runId;
      if (!runId) {
        console.error('[tesbo-uploader-v3] ❌ runId missing in response');
        return null;
      }
      console.log(`[tesbo-uploader-v3] ✅ Run created: ${runId}`);
      return runId;
    } catch (err) {
      const cause = err?.cause || {};
      const detail = JSON.stringify({
        code: cause.code,
        errno: cause.errno,
        syscall: cause.syscall,
        address: cause.address,
        port: cause.port,
        host: cause.host
      });
      console.error('[tesbo-uploader-v3] ❌ Run creation error:', err?.message || err);
      console.error('[tesbo-uploader-v3] ❌ Error stack:', err?.stack);
      if (cause && (cause.code || cause.errno)) {
        console.error(`[tesbo-uploader-v3] ❌ Network detail: ${detail}`);
      }
      return null;
    }
  }

  async _uploadJsonTest(runId, testNode, config) {
    const apiKey = this._resolveApiKey();
    if (!apiKey) {
      console.warn('[tesbo-uploader-v3] ⚠️  Skipping test upload: missing API key.');
      return;
    }

    const result = Array.isArray(testNode.results) && testNode.results.length
      ? testNode.results[testNode.results.length - 1]
      : {};

    const payload = this._clean({
      specName: this._jsonSpecName(testNode, config),
      testName: testNode.title || 'Test',
      fullTitle: this._jsonFullTitle(testNode),
      status: this._mapStatus(result.status || testNode.status || testNode.expectedStatus),
      durationMs: result.duration,
      errorMessage: this._errorMessage(result),
      errorStack: this._errorStack(result),
      attempt: result.retry ?? 0,
      tags: this._jsonTags(testNode),
      steps: this._jsonSteps(result)
    });

    const baseUrl = this._resolveBaseUrl();
    const url = `${baseUrl}/ingest/playwright/runs/${runId}/tests`;

    let attempt = 1;
    while (true) {
      const artifacts = await this._collectArtifactsFromAttachments(result.attachments);
      const artifactSummary = artifacts.map(a => `${a.kind}:${path.basename(a.filePath)}`).join(', ') || 'none';
      const form = await this._buildForm(payload, artifacts);
      this._logFormEntries(form);
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'X-API-Key': apiKey,
            'Idempotency-Key': this._idempotencyKey(runId, payload)
          },
          body: form
        });
        const body = await res.text();
        const requestId = res.headers.get('x-request-id') || res.headers.get('x-correlation-id');
        if (requestId) console.log(`[tesbo-uploader-v3] Test upload request id: ${requestId}`);
        console.log(`[tesbo-uploader-v3] Test upload response (${res.status}): raw=${body}`);
        const parsed = this._safeJson(body);
        if (parsed) console.log('[tesbo-uploader-v3] Test upload parsed response:', parsed);
        console.log(`[tesbo-uploader-v3] Artifacts sent: ${artifactSummary}`);
        if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText || ''}`.trim());

        console.log(`[tesbo-uploader-v3] ✅ Uploaded test ${payload.fullTitle || payload.testName}`);
        const status = payload.status;
        if (status && this.uploadedStatusCounts[status] !== undefined) {
          this.uploadedStatusCounts[status] += 1;
        }
        return;
      } catch (err) {
        const backoffMs = Math.min(30000, 1000 * attempt);
        console.error(`[tesbo-uploader-v3] ❌ Test upload error (attempt ${attempt}):`, err?.message || err);
        if (err?.stack) console.error(err.stack);
        console.log(`[tesbo-uploader-v3] Retrying test upload in ${backoffMs}ms...`);
        await this._delay(backoffMs);
        attempt += 1;
      }
    }
  }

  async _completeRun() {
    const apiKey = this._resolveApiKey();
    if (!apiKey) {
      console.warn('[tesbo-uploader-v3] ⚠️  Skipping run completion: missing API key.');
      return;
    }

    const runId = await this.runPromise;
    if (!runId) {
      console.warn('[tesbo-uploader-v3] ⚠️  Skipping run completion: run was not created.');
      return;
    }

    const baseUrl = this._resolveBaseUrl();
    const url = `${baseUrl}/ingest/playwright/runs/${runId}/complete`;
    try {
      console.log(`[tesbo-uploader-v3] Completing run ${runId} at ${url}`);
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'X-API-Key': apiKey }
      });
      const body = await res.text();
      const requestId = res.headers.get('x-request-id') || res.headers.get('x-correlation-id');
      console.log(`[tesbo-uploader-v3] Run complete response status: ${res.status} ${res.statusText}`);
      if (requestId) console.log(`[tesbo-uploader-v3] Run complete request id: ${requestId}`);
      if (!res.ok) {
        console.error(`[tesbo-uploader-v3] ❌ Run completion failed (${res.status} ${res.statusText}): ${body}`);
      } else {
        console.log(`[tesbo-uploader-v3] ✅ Run ${runId} completed: ${body}`);
      }
    } catch (err) {
      console.error('[tesbo-uploader-v3] ❌ Run completion error:', err?.message || err);
      console.error('[tesbo-uploader-v3] ❌ Error stack:', err?.stack);
    }
  }

  _resolveApiKey() {
    return this.apiKey || process.env[this.apiKeyEnv];
  }

  _resolveBaseUrl() {
    const fromEnv = process.env[this.reportingPortalUrlEnv];
    const fromLegacy = process.env.TESBO_BASE_URL;
    const base = fromEnv || fromLegacy || this.reportingPortalUrl || '';
    const cleaned = base.replace(/\/$/, '');

    if (!this._baseUrlInfoLogged) {
      const source = fromEnv
        ? `env:${this.reportingPortalUrlEnv}`
        : fromLegacy
          ? 'env:TESBO_BASE_URL'
          : 'config:reportingPortalUrl';
      console.log(`[tesbo-uploader-v3] Using reporting base URL: "${cleaned || '(empty)'}" (source: ${source})`);
      if (fromEnv || fromLegacy) {
        console.log('[tesbo-uploader-v3] Note: env vars override config reportingPortalUrl. Clear them to use config value.');
      }
      this._baseUrlInfoLogged = true;
    }

    return cleaned;
  }

  _resolveRunTitle() {
    return this.runTitle
      || process.env.TESBO_RUN_TITLE
      || process.env.GITHUB_REF
      || process.env.CI_COMMIT_REF_NAME
      || 'Playwright Run';
  }

  _clean(obj) {
    return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined && v !== null));
  }

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  _safeJson(text) {
    try {
      return JSON.parse(text);
    } catch {
      return undefined;
    }
  }

  _mapStatus(status) {
    if (status === 'passed') return 'PASSED';
    if (status === 'skipped') return 'SKIPPED';
    return 'FAILED';
  }

  _errorMessage(result) {
    return result?.error?.message
      || (Array.isArray(result?.errors) && result.errors[0]?.message)
      || undefined;
  }

  _errorStack(result) {
    return result?.error?.stack
      || (Array.isArray(result?.errors) && result.errors[0]?.stack)
      || undefined;
  }

  _jsonTags(testNode) {
    const tags = Array.isArray(testNode?.tags) ? testNode.tags.filter(Boolean) : [];
    return tags.length ? tags : undefined;
  }

  _jsonSteps(result) {
    if (!Array.isArray(result?.steps)) return undefined;
    const steps = result.steps.map(step => this._clean({
      description: step?.title,
      status: step?.error ? 'FAILED' : 'PASSED',
      durationMs: step?.duration
    }));
    return steps.length ? steps : undefined;
  }

  _jsonSpecName(testNode, config) {
    const rootDir = config?.rootDir || process.cwd();
    const abs = testNode.__absFile
      || (testNode.file
        ? path.isAbsolute(testNode.file) ? testNode.file : path.join(rootDir, testNode.file)
        : undefined);
    const relative = abs ? path.relative(process.cwd(), abs) : (testNode.file || 'unknown-spec');
    const project = testNode.projectName || testNode.projectId;
    const suffix = project ? ` [${project}]` : '';
    return `${relative}${suffix}`;
  }

  _jsonFullTitle(testNode) {
    if (Array.isArray(testNode.titlePath) && testNode.titlePath.length) {
      return testNode.titlePath.filter(Boolean).join(' > ');
    }
    if (testNode.title) return testNode.title;
    return 'Test';
  }

  _extractJsonTests(json) {
    const out = [];
    const rootDir = json?.config?.rootDir || process.cwd();

    const walkSuite = (suite, inheritedFile) => {
      const suiteFile = suite?.file || inheritedFile;
      if (Array.isArray(suite?.specs)) {
        for (const spec of suite.specs) {
          walkSpec(spec, suiteFile);
        }
      }
      if (Array.isArray(suite?.suites)) {
        for (const child of suite.suites) {
          walkSuite(child, suiteFile);
        }
      }
    };

    const walkSpec = (spec, inheritedFile) => {
      const specFile = spec?.file || inheritedFile;
      if (Array.isArray(spec?.tests)) {
        for (const test of spec.tests) {
          out.push({ ...test, file: specFile, title: test?.title || spec?.title, titlePath: test?.titlePath || spec?.titlePath });
        }
      }
      if (Array.isArray(spec?.suites)) {
        for (const child of spec.suites) {
          walkSuite(child, specFile);
        }
      }
    };

    if (Array.isArray(json?.suites)) {
      for (const suite of json.suites) {
        walkSuite(suite, suite?.file);
      }
    }

    return out.map(t => {
      const filePath = t?.file
        ? path.isAbsolute(t.file)
          ? t.file
          : path.join(rootDir, t.file)
        : undefined;
      return { ...t, __absFile: filePath };
    });
  }

  _earliestStart(tests) {
    let earliest = null;
    for (const t of tests) {
      const results = Array.isArray(t.results) ? t.results : [];
      for (const r of results) {
        if (!r?.startTime) continue;
        const ts = new Date(r.startTime).getTime();
        if (!Number.isFinite(ts)) continue;
        if (earliest === null || ts < earliest) earliest = ts;
      }
    }
    return earliest ? new Date(earliest).toISOString() : null;
  }

  async _uploadAllJsonTests(runId, tests, config) {
    if (!Array.isArray(tests) || !tests.length) return;
    const limit = Math.max(1, Math.min(this.concurrency, tests.length));
    let idx = 0;
    const worker = async () => {
      while (true) {
        const current = idx++;
        if (current >= tests.length) return;
        const testNode = tests[current];
        try {
          await this._uploadJsonTest(runId, testNode, config);
        } catch (err) {
          const name = testNode?.title || testNode?.fullTitle || 'Test';
          console.error(`[tesbo-uploader-v3] ❌ Upload failed for test "${name}" at index ${current}:`, err?.message || err);
          if (err?.stack) console.error(err.stack);
        }
      }
    };
    await Promise.all(Array.from({ length: limit }, () => worker()));
  }

  async _collectArtifactsFromAttachments(attachments) {
    const list = Array.isArray(attachments) ? attachments : [];
    const picked = { trace: null, screenshot: null, video: null };
    for (const att of list) {
      const kind = this._detectKind(att?.name || '', att?.contentType || '', att?.path || '');
      console.log(`[tesbo-uploader-v3] Attachment detected: name="${att?.name}", contentType="${att?.contentType}", path="${att?.path}" => kind="${kind}"`);
      if (!kind || !att?.path) continue;
      picked[kind] = att.path;
    }

    const artifacts = [];
    for (const kind of ['trace', 'screenshot', 'video']) {
      const filePath = picked[kind];
      if (!filePath) continue;
      const exists = await this._fileExists(filePath);
      if (exists) {
        artifacts.push({ kind, filePath });
        console.log(`[tesbo-uploader-v3] ✓ ${kind} file exists and will be uploaded: ${filePath}`);
      } else {
        console.warn(`[tesbo-uploader-v3] ✗ Skipping ${kind} at ${filePath}: file missing`);
      }
    }
    return artifacts;
  }

  async _buildForm(payload, artifacts) {
    const form = new FormData();
    form.set('test', JSON.stringify(payload));
    for (const { kind, filePath } of artifacts) {
      await this._attachFile(form, kind, filePath);
    }
    return form;
  }

  _logFormEntries(form) {
    const entries = [];
    for (const [key, value] of form.entries()) {
      if (value instanceof File) {
        entries.push(`${key}:${value.name} (${value.type}, ${value.size} bytes)`);
      } else {
        entries.push(`${key}:${typeof value}`);
      }
    }
    console.log(`[tesbo-uploader-v3] FormData entries being sent: ${entries.join(', ')}`);
  }

  _detectKind(name, contentType, filePath) {
    const ext = path.extname(filePath || '').toLowerCase();
    const loweredName = (name || '').toLowerCase();
    const loweredType = (contentType || '').toLowerCase();
    if (ext === '.zip' || loweredType.includes('zip') || loweredName.includes('trace')) return 'trace';
    if (loweredType.startsWith('image/') || loweredName.includes('screenshot') || ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext)) {
      return 'screenshot';
    }
    if (loweredType.startsWith('video/') || loweredName.includes('video') || ['.webm', '.mp4', '.mov', '.mkv'].includes(ext)) {
      return 'video';
    }
    return null;
  }

  async _attachFile(form, kind, filePath) {
    try {
      const buf = await fs.promises.readFile(filePath);
      const { filename, mime } = this._buildFileMeta(filePath, kind);
      form.set(kind, new File([buf], filename, { type: mime }));
      console.log(`[tesbo-uploader-v3] ✓ Attached ${kind}: ${filePath} (${mime}, ${buf.length} bytes, field="${kind}", filename="${filename}")`);
    } catch (err) {
      console.warn(`[tesbo-uploader-v3] ✗ Unable to attach ${kind} ${filePath}: ${err?.message || err}`);
    }
  }

  _buildFileMeta(filePath, kind) {
    const ext = path.extname(filePath || '').toLowerCase();
    if (kind === 'trace') {
      return { filename: path.basename(filePath) || 'trace.zip', mime: 'application/zip' };
    }
    if (kind === 'screenshot') {
      const mime = ext === '.jpg' || ext === '.jpeg' ? 'image/jpeg'
        : ext === '.gif' ? 'image/gif'
        : ext === '.webp' ? 'image/webp'
        : 'image/png';
      return { filename: path.basename(filePath) || `screenshot${ext || '.png'}`, mime };
    }
    const mime = ext === '.mp4' ? 'video/mp4'
      : ext === '.mov' ? 'video/quicktime'
      : 'video/webm';
    return { filename: path.basename(filePath) || `video${ext || '.webm'}`, mime };
  }

  async _fileExists(filePath) {
    try {
      await fs.promises.stat(filePath);
      return true;
    } catch {
      return false;
    }
  }

  _idempotencyKey(runId, payload) {
    const raw = `${runId}-${payload.specName}-${payload.testName}-${payload.attempt ?? 0}`;
    return crypto.createHash('sha1').update(raw).digest('hex');
  }
}

module.exports = TesboUploaderV3;