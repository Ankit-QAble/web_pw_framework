const { readFileSync, writeFileSync, mkdirSync, existsSync } = require('fs');
const { join, dirname, relative, sep } = require('path');
const { fetch } = require('undici');
require('dotenv').config();

function getEnv(key, def = '') {
  return process.env[key] || def;
}

function readRuleFile() {
  const rulePath = join(process.cwd(), 'framework', 'RuleFile.md');
  try {
    return readFileSync(rulePath, 'utf8');
  } catch {
    return '';
  }
}

function stripCodeFences(text) {
  if (!text) return '';
  return text
    .replace(/^```[\s\S]*?\n/, '')
    .replace(/```$/, '')
    .trim();
}

async function callOpenAI({ apiKey, model, system, user }) {
  const url = 'https://api.openai.com/v1/chat/completions';
  const body = {
    model: model || 'gpt-4o-mini',
    temperature: 0.2,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content: user }
    ]
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI error: ${res.status} ${err}`);
  }
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content || '';
  return stripCodeFences(content);
}

async function callAnthropic({ apiKey, model, system, user }) {
  const url = 'https://api.anthropic.com/v1/messages';
  const body = {
    model: model || 'claude-3-5-sonnet-latest',
    max_tokens: 2000,
    system,
    messages: [
      { role: 'user', content: user }
    ]
  };
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Anthropic error: ${res.status} ${err}`);
  }
  const data = await res.json();
  const content = (data?.content?.[0]?.text) || '';
  return stripCodeFences(content);
}

function offlineTemplate(prompt, outfile) {
  const isLogin = /login/i.test(prompt);
  const defaultContent = `
import { test } from '../../framework/core/BaseTest';
import { LoginPage } from '../pages/LoginPage';
const BASE_URL = (global as any).selectedProfile?.baseURL;
test.describe('AI Generated', () => {
  let loginPage: LoginPage;
  test.beforeEach(async ({ page }, testInfo) => {
    loginPage = new LoginPage(page, BASE_URL, testInfo);
    await loginPage.navigateToLogin();
  });
  test('Login with valid credentials', async ({ logger }) => {
    await logger.step('Login with valid credentials', async () => {
      await loginPage.loginWithValidCredentials();
    });
    await logger.step('Verify OTP page', async () => {
      await loginPage.verifyEnterOTPPage();
    });
  });
});
`.trim() + '\n';
  return defaultContent;
}

function ensureDir(filePath) {
  const dir = dirname(filePath);
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}

async function main() {
  const [, , ...args] = process.argv;
  const promptArgIndex = args.findIndex(a => !a.startsWith('--'));
  if (promptArgIndex === -1) {
    console.error('Usage: npm run ai:generate -- "Create automation script for login" [--outfile test/specs/ai/login_ai.spec.ts] [--provider openai|anthropic] [--model modelName]');
    process.exit(1);
  }
  const prompt = args[promptArgIndex];
  const outfileFlag = args.find(a => a.startsWith('--outfile='));
  const modeFlag = args.find(a => a.startsWith('--mode='));
  const providerFlag = args.find(a => a.startsWith('--provider='));
  const modelFlag = args.find(a => a.startsWith('--model='));

  const outfile = outfileFlag
    ? outfileFlag.split('=')[1]
    : 'test/specs/ai/login_ai.spec.ts';
  const mode = (modeFlag ? modeFlag.split('=')[1] : 'pom').toLowerCase();
  const provider = (providerFlag ? providerFlag.split('=')[1] : getEnv('AI_PROVIDER', '')).toLowerCase();
  const model = modelFlag ? modelFlag.split('=')[1] : getEnv('AI_MODEL', '');

  const openaiKey = getEnv('OPENAI_API_KEY', '');
  const anthropicKey = getEnv('ANTHROPIC_API_KEY', '');

  const ruleContent = readRuleFile();
  const baseDir = process.cwd();
  const specPath = join(baseDir, outfile);
  const specDir = dirname(specPath);
  const baseName = outfile.replace(/\.spec\.ts$/, '').split('/').pop() || 'generated';
  const pagePathRel = `test/pages/ai/${baseName}Page.ts`;
  const locatorsPathRel = `test/locators/ai/${baseName}Locators.ts`;
  const pagePathAbs = join(baseDir, pagePathRel);
  const locatorsPathAbs = join(baseDir, locatorsPathRel);
  const baseTestAbs = join(baseDir, 'framework', 'core', 'BaseTest.ts');
  function toPosix(p) { return p.split(sep).join('/'); }
  function relImportPath(fromDir, targetAbs) {
    let rel = relative(fromDir, targetAbs);
    rel = toPosix(rel).replace(/\.ts$/, '');
    if (!rel.startsWith('.')) rel = './' + rel;
    return rel;
  }
  const baseTestImport = relImportPath(specDir, baseTestAbs);

  const systemPrompt = [
    'You generate Playwright TypeScript tests for this repository.',
    'Follow these constraints strictly:',
    '- Use framework/core/BaseTest for test imports.',
    '- Spec files must only contain test flows and assertions.',
    '- Call methods on Page objects; do not implement page logic inside specs.',
    '- Keep selectors in test/locators files.',
    '- Use async/await correctly.',
    '- Store static test data in test/data JSON; do not hardcode credentials.',
    '- Do not add comments.',
    ruleContent,
    mode === 'pom'
      ? `Return JSON with fields: 
{"specPath":"${outfile}","specCode":"<code>","pagePath":"${pagePathRel}","pageCode":"<code>","locatorsPath":"${locatorsPathRel}","locatorsCode":"<code>"}`
      : ''
  ].filter(Boolean).join('\n');

  const userPrompt = mode === 'pom'
    ? [
        'Task:',
        prompt,
        '',
        'Generate POM with:',
        `- Spec at ${outfile} using "import { test } from '${baseTestImport}';"`,
        `- Page at ${pagePathRel} extending BasePage`,
        `- Locators at ${locatorsPathRel} exporting a const *Locators`,
        'Only return a single JSON object with fields: specPath, specCode, pagePath, pageCode, locatorsPath, locatorsCode'
      ].join('\n')
    : [
        'Task:',
        prompt,
        '',
        'Output only a single TypeScript spec file content targeting Playwright.',
        'Ensure imports are relative to this repo:',
        `import { test } from '${baseTestImport}';`,
        "Use Page objects from '../pages' when applicable.",
        'Use selectedProfile.baseURL from global if a URL is needed.',
        'No comments; keep code concise and idiomatic.'
      ].join('\n');

  let code = '';
  try {
    if (provider === 'openai' && openaiKey) {
      code = await callOpenAI({ apiKey: openaiKey, model, system: systemPrompt, user: userPrompt });
    } else if (provider === 'anthropic' && anthropicKey) {
      code = await callAnthropic({ apiKey: anthropicKey, model, system: systemPrompt, user: userPrompt });
    } else if (openaiKey) {
      code = await callOpenAI({ apiKey: openaiKey, model, system: systemPrompt, user: userPrompt });
    } else if (anthropicKey) {
      code = await callAnthropic({ apiKey: anthropicKey, model, system: systemPrompt, user: userPrompt });
    } else {
      code = offlineTemplate(prompt, outfile);
    }
  } catch (e) {
    code = offlineTemplate(prompt, outfile);
  }

  if (mode === 'pom') {
    let parsed;
    try {
      parsed = JSON.parse(code);
    } catch {
      parsed = null;
    }
    if (parsed && parsed.specCode && parsed.pageCode && parsed.locatorsCode) {
      ensureDir(specPath);
      ensureDir(pagePathAbs);
      ensureDir(locatorsPathAbs);
      writeFileSync(specPath, parsed.specCode, 'utf8');
      writeFileSync(pagePathAbs, parsed.pageCode, 'utf8');
      writeFileSync(locatorsPathAbs, parsed.locatorsCode, 'utf8');
      console.log(`Generated POM:\n- ${outfile}\n- ${pagePathRel}\n- ${locatorsPathRel}`);
    } else {
      // Fallback to single-file template when JSON not provided
      ensureDir(specPath);
      writeFileSync(specPath, offlineTemplate(prompt, outfile), 'utf8');
      console.log(`Generated (fallback spec only): ${outfile}`);
    }
  } else {
    const absOutfile = specPath;
    ensureDir(absOutfile);
    writeFileSync(absOutfile, code, 'utf8');
    console.log(`Generated: ${outfile}`);
  }
}

main().catch(err => {
  console.error(err?.message || String(err));
  process.exit(1);
});
