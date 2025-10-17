# Azure Pipelines Setup Guide

This guide will help you set up Azure Pipelines for your Playwright TypeScript Framework.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Pipeline Configuration](#pipeline-configuration)
- [Environment Variables](#environment-variables)
- [Running the Pipeline](#running-the-pipeline)
- [Viewing Reports](#viewing-reports)
- [Advanced Configuration](#advanced-configuration)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before setting up Azure Pipelines, ensure you have:

1. **Azure DevOps Account**: Sign up at [dev.azure.com](https://dev.azure.com)
2. **Azure DevOps Organization**: Create an organization if you don't have one
3. **Azure DevOps Project**: Create a project for your tests
4. **Git Repository**: Your code should be in Azure Repos, GitHub, or another supported Git provider
5. **Service Connections** (Optional): For accessing external resources

---

## Initial Setup

### Step 1: Connect Your Repository

1. Navigate to your Azure DevOps project
2. Go to **Pipelines** → **Create Pipeline**
3. Select where your code is hosted:
   - Azure Repos Git
   - GitHub
   - Bitbucket Cloud
   - Other Git

4. Select your repository
5. Choose **Existing Azure Pipelines YAML file**
6. Select the `azure-pipelines.yml` file from the repository

### Step 2: Configure Service Connection (Optional)

If using Azure Playwright Testing (cloud browsers), set up a service connection:

1. Go to **Project Settings** → **Service Connections**
2. Click **New service connection**
3. Select **Azure Resource Manager**
4. Choose **Service Principal (automatic)**
5. Select your subscription and resource group
6. Name it (e.g., "AzurePlaywrightTesting")
7. Grant access to all pipelines

---

## Pipeline Configuration

The `azure-pipelines.yml` file includes the following stages:

### 1. **Setup Stage**
- Installs Node.js and dependencies
- Installs Playwright browsers
- Caches npm packages for faster builds

### 2. **Smoke Tests Stage**
- Runs tests tagged with `@smoke`
- Executes tests on Chromium, Firefox, and WebKit in parallel
- Publishes test results and artifacts

### 3. **Critical Tests Stage**
- Runs tests tagged with `@critical`
- Executes on Chromium browser
- Publishes test results and artifacts

### 4. **Full Tests Stage**
- Runs the complete test suite
- Executes on all configured browsers
- Publishes comprehensive test results

### 5. **Generate Reports Stage**
- Generates Allure report from test results
- Publishes the report as a pipeline artifact

### 6. **Azure Cloud Tests Stage** (Optional)
- Runs tests on Azure Playwright Testing (cloud browsers)
- Only executes if `PLAYWRIGHT_SERVICE_URL` is configured

---

## Environment Variables

Configure the following variables in Azure Pipelines:

### Required Variables

Go to **Pipelines** → **Edit** → **Variables** and add:

| Variable Name | Description | Example | Required |
|--------------|-------------|---------|----------|
| `NODE_VERSION` | Node.js version | `20.x` | Yes |
| `CI` | Indicates CI environment | `true` | Yes |

### Optional Variables (for Azure Cloud Testing)

| Variable Name | Description | Example | Required |
|--------------|-------------|---------|----------|
| `PLAYWRIGHT_SERVICE_URL` | Azure Playwright Testing endpoint | `https://eastus.api.playwright.microsoft.com/accounts/<workspace-id>/browsers` | No |
| `PLAYWRIGHT_SERVICE_ACCESS_TOKEN` | Access token for Azure service | (Use secret variable) | No |

### Application-Specific Variables

Add any environment variables your tests need:

| Variable Name | Description | Example |
|--------------|-------------|---------|
| `BASE_URL` | Application URL | `https://your-app.com` |
| `TEST_USERNAME` | Test user username | `testuser@example.com` |
| `TEST_PASSWORD` | Test user password (secret) | `********` |

**Note**: Mark sensitive variables as **Secret** by clicking the lock icon.

---

## Running the Pipeline

### Automatic Triggers

The pipeline automatically runs on:
- **Push** to `main`, `develop`, or `feature/*` branches
- **Pull Requests** to `main` or `develop` branches

### Manual Run

1. Go to **Pipelines**
2. Select your pipeline
3. Click **Run pipeline**
4. Choose the branch
5. Optionally override variables
6. Click **Run**

### Run Specific Stages

You can configure the pipeline to run specific stages:

```bash
# In your pipeline, add parameters
parameters:
  - name: runSmokeTests
    type: boolean
    default: true
  - name: runCriticalTests
    type: boolean
    default: true
  - name: runFullTests
    type: boolean
    default: false
```

---

## Viewing Reports

### Test Results

1. Navigate to your pipeline run
2. Click on the **Tests** tab
3. View test pass/fail statistics, trends, and individual test results

### Playwright HTML Report

1. Go to the pipeline run
2. Click on the **Artifacts** section
3. Download `playwright-report-*` artifact
4. Extract and open `index.html` in a browser

### Allure Report

1. Go to the pipeline run
2. Click on **Artifacts**
3. Download `allure-report` artifact
4. Extract and open `index.html` in a browser

**Tip**: You can also use the Allure extension for Azure DevOps to view reports directly in the pipeline.

### Screenshots and Videos

Screenshots and videos are available in the artifacts:
- `screenshots-*` - Test screenshots
- Traces are included in the Playwright report

---

## Advanced Configuration

### Parallel Testing

The pipeline is configured for parallel execution:

```yaml
strategy:
  matrix:
    chromium:
      BROWSER: 'chromium'
    firefox:
      BROWSER: 'firefox'
    webkit:
      BROWSER: 'webkit'
```

### Custom Test Tags

Add more test execution stages with custom tags:

```yaml
- stage: RegressionTests
  displayName: 'Run Regression Tests'
  jobs:
    - job: RunRegressionTests
      steps:
        - script: |
            npx playwright test --grep="@regression"
          displayName: 'Run Regression Tests'
```

### Email Notifications

Configure email notifications:

1. Go to **Project Settings** → **Notifications**
2. Click **New subscription**
3. Choose **Build completed** or **Build failed**
4. Configure recipients and conditions

### Slack/Teams Integration

Integrate with communication tools:

1. Install the Azure Pipelines app for Slack/Teams
2. Configure webhook in your pipeline:

```yaml
- task: PublishToAzureServiceBus@1
  inputs:
    # Configure your integration
```

### Scheduled Runs

Add scheduled triggers:

```yaml
schedules:
  - cron: "0 2 * * *"  # Run at 2 AM daily
    displayName: 'Nightly Test Run'
    branches:
      include:
        - main
    always: true
```

---

## Troubleshooting

### Issue: Playwright browsers not found

**Solution**: Ensure the install step runs with `--with-deps`:
```yaml
- script: npx playwright install --with-deps
```

### Issue: Tests timeout in CI

**Solution**: Increase timeouts in `playwright.azure.config.ts`:
```typescript
timeout: 90000,  // 90 seconds
```

### Issue: Environment variables not loading

**Solution**: 
1. Verify variables are set in pipeline settings
2. Check variable group access
3. Ensure variables are passed to tasks:
```yaml
env:
  PLAYWRIGHT_SERVICE_URL: $(PLAYWRIGHT_SERVICE_URL)
```

### Issue: Artifacts not publishing

**Solution**: Ensure the artifact path exists:
```yaml
- task: PublishPipelineArtifact@1
  condition: always()  # Publish even if tests fail
```

### Issue: Cache not working

**Solution**: Verify cache key matches your package file:
```yaml
key: 'npm | "$(Agent.OS)" | package-lock.json'
```

### Issue: Azure Cloud Tests not running

**Solution**:
1. Verify `PLAYWRIGHT_SERVICE_URL` is set
2. Check `PLAYWRIGHT_SERVICE_ACCESS_TOKEN` is valid
3. Ensure service connection has proper permissions

---

## Best Practices

1. **Use Caching**: Cache `node_modules` to speed up builds
2. **Parallel Execution**: Run tests in parallel across multiple agents
3. **Fail Fast**: Use `continueOnError: true` for test stages
4. **Artifact Retention**: Configure artifact retention policies
5. **Secret Management**: Store sensitive data in Azure Key Vault
6. **Version Pinning**: Pin Node.js and dependency versions
7. **Test Organization**: Use tags (@smoke, @critical) to organize tests
8. **Monitoring**: Set up alerts for failed pipeline runs

---

## Useful Commands

Run locally with Azure configuration:
```bash
# Install dependencies
npm ci

# Install browsers
npx playwright install --with-deps

# Run smoke tests
npx playwright test --grep="@smoke"

# Run critical tests
npx playwright test --grep="@critical"

# Run with Azure config
npm run test:azure

# Generate Allure report
npx allure generate allure-results --clean
npx allure open allure-report
```

---

## Additional Resources

- [Azure Pipelines Documentation](https://docs.microsoft.com/en-us/azure/devops/pipelines/)
- [Playwright Documentation](https://playwright.dev/)
- [Azure Playwright Testing](https://azure.microsoft.com/en-us/products/playwright-testing/)
- [Allure Framework](https://docs.qameta.io/allure/)

---

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review Azure Pipelines logs
3. Consult Playwright documentation
4. Open an issue in your repository

---

**Last Updated**: October 2025
**Version**: 1.0.0

