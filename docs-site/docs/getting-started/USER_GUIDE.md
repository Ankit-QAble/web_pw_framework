---
id: user-guide
title: User Guide & Rules of Use
sidebar_position: 95
description: Shared checklist for using the web_pw_framework consistently—folder practices, locator rules, filenames, coding flow, and review expectations.
---

> Use this page as the onboarding + “rules of engagement” guide for anyone building on top of `web_pw_framework`.

## What this guide covers

- Framework overview recap and where things live
- Daily workflow (branching, scripts, verification)
- Naming conventions for files, classes, tests, and data
- Locator authoring rules and best practices
- Expectations for page objects, specs, and data files
- Review + testing checklist before opening PRs

## 1. Project structure essentials

- `framework/` holds shared base classes and utilities—treat these as reusable libraries and avoid duplicating logic in tests.
- `test/pages/` contains Page Object Model classes; each page corresponds to one file named `<PageName>Page.ts`.
- `test/locators/` stores pure locator maps in `<PageName>Locators.ts`; page objects import from here.
- `test/specs/` hosts Playwright specs; filename mirrors feature (e.g., `login.spec.ts`).
- `test/data/` is the single source for static JSON data; no inline JSON blobs in specs.

## 2. Workflow checklist

1. **Create a feature branch:** `git checkout -b feature/<ticket-or-feature>`
2. **Install deps & browsers once:** `npm install`, `npm run install:browsers`
3. **Use npm scripts for runs:** `npm test`, `npm run test:headed`, etc. Avoid direct `npx` unless debugging.
4. **Keep upstream in sync:** follow the [sync guide](../workflows/SYNC_TEMPLATE_WITH_UPSTREAM.md) before long-lived work.
5. **Run lint + targeted tests** before commit: `npm run lint`, `npx playwright test path/to/spec`.

## 3. Naming conventions

| Item | Rule | Example |
| --- | --- | --- |
| Page class | PascalCase + `Page` suffix | `LoginPage` |
| Locator file | PascalCase + `Locators.ts` | `LoginPageLocators.ts` |
| Spec file | lowercase feature + `.spec.ts` | `profile.spec.ts` |
| Test title | `[Feature] should <action>` | `@smoke [Login] should sign in with valid creds` |
| Data keys | snake_case | `default_user`, `admin_account` |
| Env variables | Upper snake | `PLAYWRIGHT_SERVICE_URL` |

Additional rules:
- Keep filenames singular (`LoginPage`, not `LoginsPage`).
- Tag tests with `@smoke`, `@critical`, etc., only at the top-level `test.describe`.

## 4. Locator authoring rules

- **Centralize selectors** in `test/locators/` and export a plain object:
  ```ts
  export const LoginPageLocators = {
    emailField: '[data-test="login-email"]',
    submitButton: 'button[type="submit"]',
  };
  ```
- Prefer `data-*` attributes over brittle CSS/XPath.
- Never call `page.locator()` inside specs—use page objects.
- Group locators by functional area, keep keys camelCase and descriptive (`emailField`, `createAccountLink`).
- If locator needs parameters, wrap it in a helper function in the locator file.

## 5. Page object expectations

- Import locators: `import {LoginPageLocators as locators} from '../locators/LoginPageLocators';`
- Inject `Page` via constructor and extend `BasePage`.
- Encapsulate actions (e.g., `async login(user)`) and assertions.
- Use `Logger` + `ScreenshotHelper` from `framework/utils` for traceability.
- Avoid test-specific assertions inside page objects; return state or throw informative errors.

## 6. Spec writing rules

- Each spec file should align to one feature or micro-service workflow.
- Arrange tests: `test.describe` → `test.beforeEach` with shared setup → atomic `test` blocks.
- Keep tests data-driven via fixtures or JSON data helpers.
- Use tags for suites: `test.describe('@smoke Login Suite', () => { ... })`.
- No sleeps; rely on Playwright’s auto-wait and expect assertions.

## 7. Test data guidelines

- Store reusable users/accounts in `test/data/users.json` (or `.csv`/`.xlsx` if tabular).
- `DataHelper` can now load JSON, CSV, and Excel—use `loadData('file.csv')`, `loadCsvData`, or `loadExcelData` as needed.
- For temporary/random data, leverage `DataHelper` utilities.
- Document each key with a short comment (if using `.ts` data modules) or README snippet.
- Keep secrets out of the repo; rely on `.env` or CI secrets.

## 8. Review + PR checklist

- ✅ Lint + targeted tests pass locally.
- ✅ Screenshots/videos verified for new flows.
- ✅ Docs or comments updated when behavior changes.
- ✅ No skipped tests committed unless justified with TODO + owner.
- ✅ Branch rebased on the latest `main`.
- Include summary + testing evidence in PR description (commands run, environments used).

## 9. Suggested future additions

- Playbook for creating new environments (staging, perf).
- Guide for extending `BasePage`/`BaseTest` with custom fixtures.
- Naming conventions for CI workflows and scripts.
- Sample checklist for onboarding new QA engineers.

Keep this page updated whenever the team adds tooling or changes conventions. A consistent framework experience starts with shared guardrails. Happy testing! 🚀

