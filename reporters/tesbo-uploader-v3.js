const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { FormData, File, fetch } = require("undici");

class BetterCasesUploaderV2 {
  constructor(options = {}) {
    this.projectAccessKey =
      options.projectAccessKey ||
      options.apiKey ||
      process.env.BETTERCASES_PROJECT_ACCESS_KEY ||
      process.env.TESBO_API_KEY;
    this.baseUrl =
      options.baseUrl ||
      options.reportingPortalUrl ||
      process.env.BETTERCASES_API_BASE_URL ||
      process.env.TESBO_REPORTING_PORTAL_URL ||
      "http://localhost:7001";
    this.jsonPath = options.jsonPath || "test-results.json";
    this.timeoutMs = Number(options.timeoutMs || process.env.BETTERCASES_UPLOAD_TIMEOUT_MS || 120000);
    this.runTitle = options.runTitle || process.env.TESBO_RUN_TITLE || process.env.BETTERCASES_RUN_TITLE || "Playwright Run";
    this.runTitleStrategy = options.runTitleStrategy || process.env.TESBO_RUN_TITLE_STRATEGY || "auto";
    // Legacy HTML report data (disabled by default as we now focus on test-results)
    this.reportDataDir = options.reportDataDir || process.env.PLAYWRIGHT_REPORT_DATA_DIR || "playwright-report/data";
    this.attachReportDataTo = options.attachReportDataTo || (process.env.TESBO_ATTACH_REPORT_DATA_TO || "none"); // "first" | "each" | "none"
    // New: Upload every artifact from Playwright test-results folder
    this.resultsDir = options.resultsDir || process.env.PLAYWRIGHT_RESULTS_DIR || "test-results";
    this.attachResultsDirTo = options.attachResultsDirTo || (process.env.TESBO_ATTACH_RESULTS_DIR_TO || "each"); // "first" | "each" | "none"
  }

  onBegin() {}

  async onEnd() {
    if (!this.projectAccessKey) {
      console.warn(
        `[bettercases-uploader-v2] Missing projectAccessKey; skipping upload. key=${this.projectAccessKey ? "set" : "missing"}`
      );
      return;
    }

    const reportPath = path.isAbsolute(this.jsonPath) ? this.jsonPath : path.join(process.cwd(), this.jsonPath);
    const report = await this._readJsonReport(reportPath);
    if (!report) {
      console.warn(`[bettercases-uploader-v2] Report not found or invalid JSON: ${reportPath}`);
      return;
    }

    const extracted = this._extractJsonTests(report);
    if (!extracted.length) {
      console.log("[bettercases-uploader-v2] No tests found in report.");
      return;
    }

    const testsPayload = extracted.map((t) => ({
      caseId: t.caseId,
      spec: t.specName,
      name: t.testName,
      fullTitle: t.fullTitle,
      status: t.status,
      durationMs: t.durationMs,
      errorMessage: t.errorMessage,
      errorStack: t.errorStack,
      attempt: t.attempt,
      tags: t.tags,
      steps: t.steps,
      projectName: t.projectName,
      browserName: t.browserName,
      browserVersion: t.browserVersion,
      osName: t.osName,
      osPlatform: t.osPlatform,
      osArch: t.osArch,
    }));

    const payload = {
      runName: this._resolveRunTitle(extracted, report),
      status: "COMPLETED",
      sourceType: "PLAYWRIGHT",
      branchName: process.env.GITHUB_REF_NAME || process.env.CI_COMMIT_REF_NAME,
      pullRequest: process.env.GITHUB_PR_NUMBER || process.env.CI_MERGE_REQUEST_IID,
      commitAuthor: process.env.GITHUB_ACTOR || process.env.CI_COMMIT_AUTHOR,
      githubRunId: process.env.GITHUB_RUN_ID || process.env.CI_PIPELINE_ID,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      tests: testsPayload,
    };

    const runId = await this._createRun(payload);
    if (!runId) return;

    let uploadedArtifacts = 0;
    const uploadedPaths = new Set();
    for (const test of extracted) {
      for (const artifact of test.artifacts) {
        const absPath = path.isAbsolute(artifact.filePath) ? artifact.filePath : path.join(process.cwd(), artifact.filePath);
        const normPath = path.normalize(absPath);
        const ok = await this._uploadArtifact(runId, test.caseId, artifact.kind, normPath);
        if (ok) uploadedArtifacts += 1;
        uploadedPaths.add(normPath);
      }
    }

    // Optionally attach Playwright HTML report data files (playwright-report/data)
    // This helps preserve UI report artifacts (hashed images, videos, trace zips).
    const reportDataFiles = await this._collectReportDataFiles(this.reportDataDir);
    if (reportDataFiles.length && this.attachReportDataTo !== "none") {
      if (this.attachReportDataTo === "first" && extracted.length) {
        const firstCaseId = extracted[0].caseId;
        for (const filePath of reportDataFiles) {
          const kind = this._detectKind("", "", filePath);
          if (!kind) continue;
          const ok = await this._uploadArtifact(runId, firstCaseId, kind, filePath);
          if (ok) uploadedArtifacts += 1;
        }
      } else if (this.attachReportDataTo === "each" && extracted.length) {
        for (const test of extracted) {
          for (const filePath of reportDataFiles) {
            const kind = this._detectKind("", "", filePath);
            if (!kind) continue;
            const ok = await this._uploadArtifact(runId, test.caseId, kind, filePath);
            if (ok) uploadedArtifacts += 1;
          }
        }
      }
    }

    // NEW: Attach ALL files from test-results (recursively), de-duplicating those already uploaded
    const resultsFiles = await this._collectFilesRecursive(this.resultsDir);
    if (resultsFiles.length && this.attachResultsDirTo !== "none") {
      if (this.attachResultsDirTo === "first" && extracted.length) {
        const firstCaseId = extracted[0].caseId;
        for (const filePath of resultsFiles) {
          const abs = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
          const norm = path.normalize(abs);
          if (uploadedPaths.has(norm)) continue;
          const kind = this._detectKind("", "", norm);
          if (!kind) continue;
          const ok = await this._uploadArtifact(runId, firstCaseId, kind, norm);
          if (ok) {
            uploadedArtifacts += 1;
            uploadedPaths.add(norm);
          }
        }
      } else if (this.attachResultsDirTo === "each" && extracted.length) {
        for (const test of extracted) {
          for (const filePath of resultsFiles) {
            const abs = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
            const norm = path.normalize(abs);
            if (uploadedPaths.has(norm)) continue;
            const kind = this._detectKind("", "", norm);
            if (!kind) continue;
            const ok = await this._uploadArtifact(runId, test.caseId, kind, norm);
            if (ok) {
              uploadedArtifacts += 1;
              uploadedPaths.add(norm);
            }
          }
        }
      }
    }

    console.log(
      `[bettercases-uploader-v2] ✅ Run uploaded: ${runId}. Tests: ${testsPayload.length}, artifacts uploaded: ${uploadedArtifacts}`
    );
  }

  async _createRun(payload) {
    const endpoint = `${this._cleanBaseUrl()}/api/tesbo-reports/ingest/playwright`;
    const res = await this._fetchWithTimeout(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-project-access-key": this.projectAccessKey,
      },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    if (!res.ok) {
      console.error(`[bettercases-uploader-v2] Run create failed (${res.status}): ${text}`);
      return null;
    }
    const parsed = this._safeJson(text);
    const runId = parsed?.runId;
    if (!runId) {
      console.error(`[bettercases-uploader-v2] Run create response missing runId: ${text}`);
      return null;
    }
    return runId;
  }

  async _uploadArtifact(runId, caseId, kind, filePath) {
    if (!(await this._fileExists(filePath))) return false;
    const endpoint = `${this._cleanBaseUrl()}/api/tesbo-reports/runs/${runId}/cases/${caseId}/artifacts/${kind}/upload`;
    const bytes = await fs.promises.readFile(filePath);
    const fileName = path.basename(filePath);
    const form = new FormData();
    form.set("file", new File([bytes], fileName, { type: this._mimeFromExt(filePath, kind) }));

    const res = await this._fetchWithTimeout(endpoint, {
      method: "POST",
      headers: {
        "x-project-access-key": this.projectAccessKey,
      },
      body: form,
    });
    if (!res.ok) {
      const text = await res.text();
      console.warn(`[bettercases-uploader-v2] Artifact upload failed (${kind}, ${fileName}) ${res.status}: ${text}`);
      return false;
    }
    return true;
  }

  _resolveRunTitle(extracted, report) {
    const strategy = String(this.runTitleStrategy || "").toLowerCase();
    if (strategy === "static") return this.runTitle;
    const specs = Array.from(new Set((extracted || []).map(t => t.specName).filter(Boolean)));
    if (strategy === "spec" && specs.length) {
      return path.basename(specs[0]);
    }
    if (strategy === "folder" && specs.length) {
      const baseTestDir = this._resolveBaseTestDir(report);
      const folder = this._firstLevelFolderUnder(specs, baseTestDir);
      if (folder) return folder;
      const dirs = specs.map(s => path.dirname(s));
      const common = this._commonDir(dirs);
      const name = common ? path.basename(common) : "Multiple";
      return `${name} (${specs.length} specs)`;
    }
    if (specs.length === 1) {
      return path.basename(specs[0]);
    }
    if (specs.length > 1) {
      const baseTestDir = this._resolveBaseTestDir(report);
      const folder = this._firstLevelFolderUnder(specs, baseTestDir);
      if (folder) return folder;
      const dirs = specs.map(s => path.dirname(s));
      const common = this._commonDir(dirs);
      const name = common ? path.basename(common) : "Multiple";
      return `${name} (${specs.length} specs)`;
    }
    return this.runTitle;
  }

  _commonDir(dirs) {
    if (!Array.isArray(dirs) || !dirs.length) return "";
    const partsArr = dirs.map(d => path.normalize(d).split(path.sep));
    const first = partsArr[0];
    let i = 0;
    while (i < first.length) {
      const segment = first[i];
      if (!partsArr.every(p => p[i] === segment)) break;
      i++;
    }
    return i ? first.slice(0, i).join(path.sep) : "";
  }

  _resolveBaseTestDir(report) {
    const cfgDir = report?.config?.testDir;
    if (typeof cfgDir === "string" && cfgDir.trim()) {
      const abs = path.isAbsolute(cfgDir) ? cfgDir : path.join(process.cwd(), cfgDir);
      return path.relative(process.cwd(), abs);
    }
    return "test/specs";
  }

  _firstLevelFolderUnder(specs, baseTestDir) {
    try {
      const folders = new Set();
      for (const spec of specs) {
        const rel = path.relative(baseTestDir, spec);
        const parts = rel.split(path.sep).filter(Boolean);
        if (parts.length >= 2) {
          // parts[0] is first-level folder under baseTestDir
          folders.add(parts[0]);
        } else if (parts.length === 1) {
          // spec directly under baseTestDir, no subfolder
        }
      }
      if (folders.size === 1) {
        return Array.from(folders)[0];
      }
      return "";
    } catch {
      return "";
    }
  }

  _extractJsonTests(json) {
    const out = [];
    const rootDir = json?.config?.rootDir || process.cwd();

    const walkSuite = (suite, inheritedFile) => {
      const suiteFile = suite?.file || inheritedFile;
      if (Array.isArray(suite?.specs)) {
        for (const spec of suite.specs) walkSpec(spec, suiteFile);
      }
      if (Array.isArray(suite?.suites)) {
        for (const child of suite.suites) walkSuite(child, suiteFile);
      }
    };

    const walkSpec = (spec, inheritedFile) => {
      const specFile = spec?.file || inheritedFile || "unknown.spec";
      if (Array.isArray(spec?.tests)) {
        for (const test of spec.tests) {
          const result = Array.isArray(test?.results) && test.results.length ? test.results[test.results.length - 1] : {};
          const specAbs = path.isAbsolute(specFile) ? specFile : path.join(rootDir, specFile);
          const specName = path.relative(process.cwd(), specAbs);
          const testName = this._testName(test, spec);
          const caseId = this._newCaseId();
          const projectName = test?.projectName || test?.projectId || undefined;
          out.push({
            caseId,
            specName,
            testName,
            fullTitle: this._fullTitle({
              ...test,
              title: test?.title || spec?.title,
              titlePath: test?.titlePath || spec?.titlePath,
            }),
            status: this._mapStatus(result?.status || test?.status || test?.expectedStatus),
            durationMs: Number(result?.duration || 0),
            errorMessage: this._errorMessage(result),
            errorStack: this._errorStack(result),
            attempt: Number(result?.retry || 0),
            tags: this._tags(test),
            steps: this._steps(result),
            projectName,
            browserName: this._browserName(projectName),
            browserVersion: undefined,
            osName: process.platform,
            osPlatform: process.platform,
            osArch: process.arch,
            artifacts: this._collectArtifacts(result?.attachments || []),
          });
        }
      }
      if (Array.isArray(spec?.suites)) {
        for (const child of spec.suites) walkSuite(child, specFile);
      }
    };

    if (Array.isArray(json?.suites)) {
      for (const suite of json.suites) walkSuite(suite, suite?.file);
    }
    return out;
  }

  _collectArtifacts(attachments) {
    const artifacts = [];
    for (const a of attachments) {
      const kind = this._detectKind(a?.name || "", a?.contentType || "", a?.path || "");
      if (!kind || !a?.path) continue;
      artifacts.push({ kind, filePath: a.path });
    }
    return artifacts;
  }

  _detectKind(name, contentType, filePath) {
    const ext = path.extname(filePath || "").toLowerCase();
    const loweredName = (name || "").toLowerCase();
    const loweredType = (contentType || "").toLowerCase();
    if (ext === ".zip" || loweredType.includes("zip") || loweredName.includes("trace")) return "trace";
    if (
      loweredType.startsWith("image/") ||
      loweredName.includes("screenshot") ||
      [".png", ".jpg", ".jpeg", ".gif", ".webp"].includes(ext)
    ) {
      return "screenshot";
    }
    if (
      loweredType.startsWith("video/") ||
      loweredName.includes("video") ||
      [".webm", ".mp4", ".mov", ".mkv"].includes(ext)
    ) {
      return "video";
    }
    return null;
  }

  async _collectReportDataFiles(dir) {
    try {
      const abs = path.isAbsolute(dir) ? dir : path.join(process.cwd(), dir);
      const stat = await fs.promises.stat(abs).catch(() => null);
      if (!stat || !stat.isDirectory()) return [];
      const files = await fs.promises.readdir(abs);
      const out = [];
      for (const f of files) {
        const p = path.join(abs, f);
        const st = await fs.promises.stat(p).catch(() => null);
        if (st && st.isFile()) out.push(p);
      }
      return out;
    } catch {
      return [];
    }
  }

  async _collectFilesRecursive(dir) {
    try {
      const abs = path.isAbsolute(dir) ? dir : path.join(process.cwd(), dir);
      const stat = await fs.promises.stat(abs).catch(() => null);
      if (!stat || !stat.isDirectory()) return [];
      const out = [];
      async function walk(current) {
        const entries = await fs.promises.readdir(current, { withFileTypes: true });
        for (const entry of entries) {
          const p = path.join(current, entry.name);
          if (entry.isDirectory()) {
            await walk(p);
          } else if (entry.isFile()) {
            out.push(p);
          }
        }
      }
      await walk(abs);
      return out;
    } catch {
      return [];
    }
  }

  _mapStatus(status) {
    if (status === "passed") return "Passed";
    if (status === "skipped") return "Skipped";
    return "Failed";
  }

  _errorMessage(result) {
    return result?.error?.message || (Array.isArray(result?.errors) ? result.errors[0]?.message : undefined) || undefined;
  }

  _errorStack(result) {
    return result?.error?.stack || (Array.isArray(result?.errors) ? result.errors[0]?.stack : undefined) || undefined;
  }

  _tags(testNode) {
    if (!Array.isArray(testNode?.tags)) return [];
    return testNode.tags.filter(Boolean).map((v) => String(v));
  }

  _steps(result) {
    if (Array.isArray(result?.steps) && result.steps.length) {
      return result.steps.map((step) => ({
        description: step?.title || "Step",
        status: step?.error ? "FAILED" : "PASSED",
        durationMs: Number(step?.duration || 0),
      }));
    }
    return this._stepsFromStdout(result?.stdout || []);
  }

  _stepsFromStdout(stdoutArr) {
    const steps = [];
    const open = new Map();
    const lines = [];
    for (const entry of stdoutArr || []) {
      const text = entry?.text || "";
      const parts = String(text).split("\n");
      for (const p of parts) {
        if (p && p.trim()) lines.push(p.trim());
      }
    }
    const startRe = /^\[(.*?)\].*?Step:\s*(.+)$/;
    const doneRe = /^\[(.*?)\].*?(✅|✔️|✔)\s*Step completed:\s*(.+)$/;
    const failRe = /^\[(.*?)\].*?(❌|✖|✕)\s*Step failed:\s*(.+)$/;
    for (const line of lines) {
      const mStart = line.includes("Step:") && !line.includes("Step completed:") && !line.includes("Step failed:")
        ? line.match(startRe)
        : null;
      if (mStart) {
        const ts = Date.parse(mStart[1]);
        const name = mStart[2].trim();
        if (!open.has(name)) open.set(name, ts);
        continue;
      }
      const mDone = line.match(doneRe);
      if (mDone) {
        const ts = Date.parse(mDone[1]);
        const name = mDone[3].trim();
        const begin = open.has(name) ? open.get(name) : undefined;
        const dur = typeof begin === "number" && isFinite(begin) && isFinite(ts) ? Math.max(0, ts - begin) : 0;
        steps.push({ description: name, status: "PASSED", durationMs: Number(dur) });
        open.delete(name);
        continue;
      }
      const mFail = line.match(failRe);
      if (mFail) {
        const ts = Date.parse(mFail[1]);
        const name = mFail[3].trim();
        const begin = open.has(name) ? open.get(name) : undefined;
        const dur = typeof begin === "number" && isFinite(begin) && isFinite(ts) ? Math.max(0, ts - begin) : 0;
        steps.push({ description: name, status: "FAILED", durationMs: Number(dur) });
        open.delete(name);
        continue;
      }
    }
    for (const [name] of open.entries()) {
      steps.push({ description: name, status: "FAILED", durationMs: 0 });
    }
    return steps;
  }

  _fullTitle(testNode) {
    if (Array.isArray(testNode?.titlePath) && testNode.titlePath.length) {
      return testNode.titlePath.filter(Boolean).join(" > ");
    }
    return testNode?.title || "Unnamed test";
  }

  _testName(testNode, specNode) {
    if (testNode?.title) return testNode.title;
    if (specNode?.title) return specNode.title;
    const titlePath = Array.isArray(testNode?.titlePath)
      ? testNode.titlePath.filter(Boolean)
      : Array.isArray(specNode?.titlePath)
      ? specNode.titlePath.filter(Boolean)
      : [];
    if (titlePath.length) return titlePath[titlePath.length - 1];
    return "Unnamed test";
  }

  _browserName(projectName) {
    const name = String(projectName || "").toLowerCase();
    if (name.includes("firefox")) return "firefox";
    if (name.includes("webkit") || name.includes("safari")) return "webkit";
    return "chromium";
  }

  _newCaseId() {
    if (typeof crypto.randomUUID === "function") return crypto.randomUUID();
    const hex = crypto.randomBytes(16).toString("hex");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
  }

  _mimeFromExt(filePath, kind) {
    const ext = path.extname(filePath).toLowerCase();
    if (kind === "trace") return "application/octet-stream";
    if (kind === "screenshot") {
      if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
      if (ext === ".gif") return "image/gif";
      if (ext === ".webp") return "image/webp";
      return "image/png";
    }
    if (ext === ".mp4") return "video/mp4";
    if (ext === ".mov") return "video/quicktime";
    return "video/webm";
  }

  _cleanBaseUrl() {
    return String(this.baseUrl || "").replace(/\/$/, "");
  }

  async _readJsonReport(reportPath) {
    if (!(await this._fileExists(reportPath))) return null;
    try {
      const raw = await fs.promises.readFile(reportPath, "utf8");
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  async _fileExists(filePath) {
    try {
      await fs.promises.stat(filePath);
      return true;
    } catch {
      return false;
    }
  }

  _safeJson(text) {
    try {
      return JSON.parse(text);
    } catch {
      return undefined;
    }
  }

  async _fetchWithTimeout(url, init) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      return await fetch(url, { ...init, signal: controller.signal });
    } finally {
      clearTimeout(timeout);
    }
  }

}

module.exports = BetterCasesUploaderV2;
