---
sidebar_position: 4
---

# Docker Setup and Usage

This guide explains how to run Playwright tests in a Docker container using the `mcp/playwright` image. Running tests in Docker ensures a consistent environment across different machines and CI/CD pipelines.

## Prerequisites

- [Docker](https://docs.docker.com/get-docker/) must be installed and running on your machine.
- `mcp/playwright` Docker image (optional, will be pulled/built automatically).

## Quick Start

We have configured `npm` scripts to make running tests in Docker easy.

### 1. Run All Tests

To run all tests in the Docker container:

```bash
npm run test:docker
```

### 2. Run Specific Test File

To run a specific test file, pass the file path as an argument:

```bash
npm run test:docker -- test/specs/dhl_careers.spec.ts
```

We also have a convenience script for the DHL Careers demo:

```bash
npm run test:docker:demo
```

## Configuration Details

The project uses `docker-compose` to manage the test environment.

- **Dockerfile**: Based on `mcp/playwright`, installs dependencies and browsers.
- **docker-compose.yml**: Mounts the project directory to `/app` in the container, ensuring you can edit tests locally and run them immediately in Docker without rebuilding.

### Dockerfile

The `Dockerfile` handles:
1.  Setting up the working directory.
2.  Installing project dependencies (`npm ci`).
3.  Installing Playwright browsers (`npx playwright install`).

### npm Script

The `test:docker` script in `package.json` runs:

```bash
docker-compose run --rm playwright-tests npx playwright test
```

## Example: Soft Assertions

Here is an example of a test using Soft Assertions, which allows the test to continue executing even if an assertion fails (useful for verifying multiple elements on a page).

```typescript
import { test } from '@playwright/test';
import { DHLCareersPage } from '../pages/DHLCareersPage';

test('Verify DHL Careers Page Content', async ({ page }) => {
  const dhlPage = new DHLCareersPage(page);
  await dhlPage.open();

  // Using verifyPageContent which implements soft assertions
  // The test will continue even if "Hero Heading" mismatches, 
  // allowing it to check "Footer Copyright" as well.
  await dhlPage.verifyPageContent({
    hero_heading: "Expected Heading",
    footer_copyright: "© 2024 DHL"
  });
});
```

### Soft Assertion Output

When running the above test in Docker, you might see output indicating a failure but continued execution:

```
Error: Text mismatch! Expected: "Expected Heading", Actual: "Actual Heading"
...
[INFO] Comparing text for element: footer_copyright
[INFO] Text comparison result: MATCH
```

## Troubleshooting

### Browser Executable Missing

If you encounter an error like `Executable doesn't exist at /ms-playwright/...`, it usually means the Docker image's installed browsers don't match the Playwright version in `package.json`.

**Solution**:
The `Dockerfile` is configured to run `npx playwright install` during the build. If issues persist, try rebuilding the image:

```bash
docker-compose build --no-cache
```
