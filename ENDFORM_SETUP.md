# Endform Setup Guide

This document explains how to set up and use Endform in this project.

## What is Endform?

[Endform](https://endform.dev) is a distributed test runner optimized for Playwright that:

- **Runs tests in isolated machines**: Each test runs in its own Firecracker MicroVM
- **Efficient dependency analysis**: Only sends required files to each runner
- **Parallel execution**: Runs hundreds of tests simultaneously
- **Automatic retry scheduling**: Can schedule retries while other tests are still running
- **Result coordination**: Merges playwright blob reports and works with your existing reporters

## Project Setup

### Files Created

1. **`.github/workflows/endform.yml`** - GitHub Actions workflow for CI/CD
2. **`endform.jsonc`** - Endform configuration file
3. **`ENDFORM_SETUP.md`** - This guide

### Scripts Added to package.json

- `npm run test:endform` - Run tests with Endform
- `npm run test:endform:dry` - Dry run to preview what will be executed

## Getting Started 

### 1. Get Your API Key

1. Sign up at [https://endform.dev](https://endform.dev)
2. Navigate to your organization settings
3. Copy your API key (starts with `ef_org_`)

### 2. Configure GitHub Actions (for CI/CD)

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `ENDFORM_API_KEY`
5. Value: Your Endform API key
6. Click **Add secret**

### 3. Configure Local Testing

**Windows PowerShell:**
```powershell
$env:ENDFORM_API_KEY="ef_org_your_key_here"
```

**Windows CMD:**
```cmd
set ENDFORM_API_KEY=ef_org_your_key_here
```

**Linux/Mac:**
```bash
export ENDFORM_API_KEY="ef_org_your_key_here"
```

## Running Tests

### Dry Run (Preview)

See what Endform will test without actually running:

```powershell
npm run test:endform:dry
```

This shows:
- Which test files will run
- What dependencies Endform detected
- Environment variables it found
- Browser configurations

### Run with Endform

```powershell
npm run test:endform
```

This will:
1. Analyze your test files and dependencies
2. Send each test to an isolated machine
3. Run tests in parallel across multiple machines
4. Collect results and merge blob reports
5. Generate your Allure reports

## How Endform Works

### Step 1: Dependency Analysis
- Endform scans your `test/specs` directory
- Calculates which files each test needs
- Finds common dependencies
- Sends this information to the test runner

### Step 2: Distributed Execution
- Each test gets its own isolated Firecracker MicroVM
- Only required files are uploaded to each machine
- Multiple tests run in parallel across different machines
- Failed tests can be retried independently

### Step 3: Result Coordination
- Playwright blob reports are collected from each machine
- Endform merges the reports using `playwright merge-reports`
- Your existing reporters (Allure, HTML, etc.) work as expected
- Results and traces are available in the dashboard

## Configuration

Edit `endform.jsonc` to customize:

```jsonc
{
  "testRunner": "playwright",
  "testDir": "./test/specs",
  "testMatch": "**/*.spec.ts",
  "config": "./playwright.config.ts",
  
  // Set max parallel workers
  "maxConcurrency": 10,
  
  // Filter tests by tags
  "testFilter": "@smoke",
  
  // Run specific browsers only
  "projects": ["chromium"]
}
```

## Benefits

### Performance
- **Fast**: Run hundreds of tests in parallel without browser bottlenecks
- **Scalable**: Add more parallelism as your test suite grows
- **Efficient**: Each machine only gets files it needs

### Reliability
- **Isolation**: Tests don't interfere with each other
- **Retries**: Failed tests can retry independently
- **Monitoring**: View results in the Endform dashboard

### Convenience
- **No infrastructure**: No need to manage your own grid
- **Local development**: Run large test suites from your machine
- **CI/CD ready**: Simple GitHub Actions integration

## Troubleshooting

### API Key Issues

**Error**: "Authentication failed"
- Verify your API key is correct
- Make sure you're using a valid API key from https://endform.dev

**Error**: "Organization not found"
- Check that you're using the correct organization key
- Key should start with `ef_org_`

### Test Execution Issues

**Tests not running**:
- Check `endform.jsonc` configuration
- Verify `testDir` points to your test directory
- Run with `--dry-run` to see what Endform detects

**Environment variables not available**:
- Endform automatically detects environment variables
- Check `npm run test:endform:dry` output
- Ensure variables are set before running tests

### Network Issues

**Connection timeout**:
- Check your internet connection
- Endform needs to upload test files to remote machines

## Advanced Usage

### Filter Tests

Run only specific tags:
```powershell
$env:ENDORM_FILTER="@smoke"
npm run test:endform
```

Or configure in `endform.jsonc`:
```jsonc
{
  "testFilter": "@smoke|@critical"
}
```

### Run Specific Test Files

```powershell
npx endform@latest test test/specs/login.spec.ts
```

### Custom Configuration

Use a specific Playwright config:
```powershell
npx endform@latest test --config=playwright.azure.config.ts
```

## Integration with Existing Workflow

Endform works alongside your existing setup:

- ✅ Works with Allure reporters
- ✅ Compatible with BrowserStack/LambdaTest configs
- ✅ Integrates with GitHub Actions
- ✅ Supports environment-based testing (dev, preprod, etc.)
- ✅ Generates the same test reports

## Next Steps

1. Set up your Endform API key (see above)
2. Run a dry run: `npm run test:endform:dry`
3. Run your first distributed test: `npm run test:endform`
4. View results in the Endform dashboard
5. Commit the workflow: The GitHub Actions setup will run on your next push

## Resources

- [Endform Documentation](https://endform.dev/docs)
- [How Tests Are Run](https://endform.dev/docs/explanation/how-your-tests-are-run)
- [Configuration Reference](https://endform.dev/docs/reference/endform-config)
- [GitHub Actions Setup](https://endform.dev/docs/reference/organization-settings#github-actions)
