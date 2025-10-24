# Playwright TypeScript Framework

Playwright TypeScript Web Automation Framework with Allure Reporting

## Summary
A Playwright-based TypeScript test framework with built-in support for multiple execution targets (local, BrowserStack, LambdaTest, Azure service/grid), Allure reporting, and convenience scripts.

## Key files
- `playwright.config.ts` - base Playwright configuration
- `playwright.service.config.ts` - service/grid configuration wrapper
- `package.json` - scripts to run tests and generate reports
- `allure-results/` - test results for Allure
- `allure-report/` - generated Allure HTML report

## Prerequisites
- Node.js (recommended v18+)
- npm (or yarn)
- Git (optional)

## Install
1. Install dependencies

```powershell
npm install
```

2. Install Playwright browsers (required for local runs)

```powershell
npm run install:browsers
```

3. (Optional) Copy environment example files and set required variables
- `env.azure.example` — example for Azure service
- `env.outlook.example` — example for email tests

You can create a `.env` file or set environment variables in your CI.

## Basic test run command
The primary command to run tests is:

```powershell
npm test
```

This runs `npx playwright test` and will execute the tests using the base Playwright config.

Other useful scripts (from `package.json`):
- `npm run test:headed` — run tests in headed mode
- `npm run test:debug` — run tests in debug mode
- `npm run test:ui` — open Playwright test UI
- `npm run test:local` — same as `npm test`
- `npm run test:azure:service` — run tests using `playwright.service.config.ts` (Azure service)
- `npm run test:browserstack` — run tests via BrowserStack SDK
- `npm run test:critical` — run `@critical` tests and generate/open Allure report

## Allure report
- Generate and serve report from results:

```powershell
npm run report
```

- Generate report files (for CI) and open locally:

```powershell
npm run report:generate
npm run report:open
```

## Playwright service / grid notes
`playwright.service.config.ts` reads environment variables to decide on service vs grid vs local:
- `PLAYWRIGHT_AZURE_SERVICE=true` — use Azure Playwright service
- `PLAYWRIGHT_SERVICE_URL` — websocket endpoint for grid/service
- `PLAYWRIGHT_SERVICE_ACCESS_TOKEN` — auth token for grid
- `PLAYWRIGHT_GRID_MODE=1` — enable grid mode when URL+token provided

When using the service or grid, ensure the required env vars are present (or use your CI secret store).

## Lint & Format
- Lint: `npm run lint`
- Format: `npm run format`

## Troubleshooting
- If browsers fail to launch, run `npm run install:browsers` and verify Playwright installation.
- For CI issues, check logs and ensure environment variables are loaded (use `npm run switch-env` to switch in some scripted setups).

## Contributing
Please open issues or PRs on the repository. Run linting and tests locally before submitting changes.

---
Generated on: 2025-10-24
