# Azure Playwright Testing Setup Guide

This guide will help you set up and run your Playwright tests on Microsoft Azure Playwright Testing service.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Step-by-Step Setup](#step-by-step-setup)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

## Prerequisites

- Active Azure subscription ([Create one here](https://portal.azure.com/))
- Node.js v16 or higher
- Azure CLI installed ([Installation Guide](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli))
- Existing Playwright test suite

## Step-by-Step Setup

### 1. Create Azure Playwright Testing Workspace

1. **Navigate to Azure Portal**
   - Go to [https://portal.azure.com/](https://portal.azure.com/)
   - Sign in with your Azure account

2. **Create Playwright Testing Resource**
   - Click on **"Create a resource"**
   - Search for **"Playwright Testing"** or **"Azure App Testing"**
   - Click **"Create"**

3. **Configure Workspace**
   - **Subscription**: Select your Azure subscription
   - **Resource Group**: Create new or use existing (e.g., `rg-playwright-testing`)
   - **Workspace Name**: Enter a unique name (e.g., `my-playwright-workspace`)
   - **Region**: Choose closest region for better performance
     - East US
     - West US
     - West Europe
     - UK South
     - Australia East
   - **Pricing Tier**: Select appropriate tier based on your needs

4. **Review and Create**
   - Click **"Review + Create"**
   - Review your configuration
   - Click **"Create"**
   - Wait for deployment to complete (usually 1-2 minutes)

5. **Get Connection Details**
   - Navigate to your newly created Playwright Testing workspace
   - Go to **"Settings"** → **"Access tokens"**
   - Click **"Generate new token"**
   - Copy the following:
     - **Service URL**: `https://<region>.api.playwright.microsoft.com`
     - **Access Token**: Save securely (shown only once)

### 2. Configure Environment Variables

1. **Copy the example file:**
   ```bash
   cp env.azure.example .env
   ```

2. **Update `.env` with your credentials:**
   ```bash
   # Azure Playwright Testing Configuration
   PLAYWRIGHT_SERVICE_URL=https://eastus.api.playwright.microsoft.com
   PLAYWRIGHT_SERVICE_ACCESS_TOKEN=your-access-token-here
   ```

3. **Alternative: Set environment variables directly**

   **PowerShell:**
   ```powershell
   $env:PLAYWRIGHT_SERVICE_URL="https://eastus.api.playwright.microsoft.com"
   $env:PLAYWRIGHT_SERVICE_ACCESS_TOKEN="your-access-token"
   ```

   **Bash/Linux:**
   ```bash
   export PLAYWRIGHT_SERVICE_URL=https://eastus.api.playwright.microsoft.com
   export PLAYWRIGHT_SERVICE_ACCESS_TOKEN=your-access-token
   ```

### 3. Verify Azure Configuration

The `playwright.azure.config.ts` file is already included in this framework and configured to:
- Connect to Azure cloud-hosted browsers via the service URL
- Use up to 20 parallel workers for fast execution
- Generate comprehensive test reports (HTML, JUnit, Allure)
- Capture traces, videos, and screenshots on failures
- Support multiple browsers and mobile devices

The configuration automatically connects to Azure when `PLAYWRIGHT_SERVICE_URL` is set.

## Configuration

### Authentication Methods

#### Option 1: Access Token (Quick Start)
```bash
PLAYWRIGHT_SERVICE_URL=https://eastus.api.playwright.microsoft.com
PLAYWRIGHT_SERVICE_ACCESS_TOKEN=your-access-token
```

#### Option 2: Entra ID (Recommended for Production)
```bash
# Login to Azure
az login

# Set environment variables
PLAYWRIGHT_SERVICE_URL=https://eastus.api.playwright.microsoft.com
PLAYWRIGHT_SERVICE_AUTH_TYPE=ENTRA_ID
```

### Service Configuration Options

The Azure configuration in `playwright.azure.config.ts` supports these key settings:

```typescript
export default defineConfig({
  // Number of parallel workers (Azure supports 20-50+ workers)
  workers: 20,
  
  // Extended timeout for cloud execution
  timeout: 60000,
  
  // Retry failed tests
  retries: 2,
  
  use: {
    // Capture traces, videos, and screenshots
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    
    // Extended timeouts
    actionTimeout: 30000,
    navigationTimeout: 60000,
  },
});
```

### Workspace Settings

```typescript
export default defineConfig({
  // High parallelization for Azure
  workers: 20, // Azure supports 20-50+ parallel workers
  
  // Extended timeout for cloud execution
  timeout: 60000,
  
  // Retry failed tests
  retries: 2,
  
  use: {
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
});
```

## Running Tests

### Basic Commands

```bash
# Run all tests on Azure
npm run test:azure

# Run smoke tests
npm run test:azure:smoke

# Run critical tests
npm run test:azure:critical

# Run multiple tags
npm run test:azure:tags
```

### Browser-Specific Tests

```bash
# Run on Chromium
npm run test:azure:chromium

# Run on Firefox
npm run test:azure:firefox

# Run on WebKit (Safari)
npm run test:azure:webkit
```

### Advanced Commands

```bash
# Run specific test file
npx playwright test -c playwright.azure.config.ts test/specs/login.spec.ts

# Run with grep pattern
npx playwright test -c playwright.azure.config.ts --grep "@smoke"

# Run in headed mode (for debugging)
npx playwright test -c playwright.azure.config.ts --headed

# Run with specific number of workers
npx playwright test -c playwright.azure.config.ts --workers=30
```

### PowerShell Commands

```powershell
# Set environment variables and run tests
$env:PLAYWRIGHT_SERVICE_URL="https://eastus.api.playwright.microsoft.com"
$env:PLAYWRIGHT_SERVICE_ACCESS_TOKEN="your-access-token"
npm run test:azure

# Run with inline environment variables
$env:PLAYWRIGHT_SERVICE_URL="https://eastus.api.playwright.microsoft.com"; $env:PLAYWRIGHT_SERVICE_ACCESS_TOKEN="your-token"; npm run test:azure:smoke
```

## Viewing Test Results

### In Azure Portal

1. Navigate to [Azure Portal](https://portal.azure.com/)
2. Go to your Playwright Testing workspace
3. Click on **"Test Runs"** in the left menu
4. Select a test run to view:
   - Test execution summary
   - Pass/fail status
   - Test duration
   - Screenshots and videos
   - Traces and logs

### Local Reports

```bash
# Generate Allure report
npm run report

# Open HTML report
npx playwright show-report
```

## Troubleshooting

### Issue 1: Authentication Failed

**Error:**
```
Error: Unable to authenticate with Azure Playwright Testing service
```

**Solution:**
1. Verify your Service URL is correct
2. Check if access token is valid and not expired
3. Generate a new access token from Azure Portal
4. For Entra ID authentication, re-login:
   ```bash
   az login
   az account show
   ```

### Issue 2: Service URL Not Set

**Error:**
```
Error: PLAYWRIGHT_SERVICE_URL is not set
```

**Solution:**
```bash
# PowerShell
$env:PLAYWRIGHT_SERVICE_URL="https://eastus.api.playwright.microsoft.com"

# Bash
export PLAYWRIGHT_SERVICE_URL=https://eastus.api.playwright.microsoft.com
```

### Issue 3: Tests Not Running in Cloud

**Problem:** Tests run locally instead of in Azure cloud browsers

**Solution:**
1. Ensure `useCloudHostedBrowsers: true` in configuration
2. Verify Azure service URL is set correctly
3. Check network connectivity to Azure services

### Issue 4: Slow Test Execution

**Problem:** Tests are slower than expected

**Solution:**
1. Increase parallel workers: `workers: 30`
2. Choose Azure region closest to your application
3. Optimize test code and selectors
4. Use proper wait strategies (avoid hard waits)
5. Review test logs for bottlenecks

### Issue 5: Access Token Expired

**Error:**
```
Error: Access token has expired
```

**Solution:**
1. Go to Azure Portal → Your workspace → Settings → Access tokens
2. Generate new access token
3. Update `.env` file with new token

## Best Practices

### 1. Use Entra ID for Production

```bash
# More secure than access tokens
export PLAYWRIGHT_SERVICE_AUTH_TYPE=ENTRA_ID
az login
```

### 2. Optimize Parallelization

```typescript
export default defineConfig({
  workers: process.env.CI ? 20 : 5,
  // Use more workers in CI, fewer locally
});
```

### 3. Configure Proper Timeouts

```typescript
use: {
  actionTimeout: 30000,      // 30 seconds for actions
  navigationTimeout: 60000,  // 60 seconds for navigation
}
```

### 4. Use Traces Wisely

```typescript
use: {
  trace: 'on-first-retry', // Only trace on retries to save resources
  video: 'retain-on-failure',
  screenshot: 'only-on-failure',
}
```

### 5. Tag Your Tests

```typescript
test('Login test @smoke @critical', async ({ page }) => {
  // Test code
});

// Run specific tags
npm run test:azure:smoke
```

### 6. Monitor Test Costs

- Azure charges based on test minutes
- Monitor usage in Azure Portal
- Set up cost alerts
- Optimize test execution time

### 7. Use Appropriate Region

Choose Azure region closest to:
- Your application servers (for best performance)
- Your team location (for lower latency)

### 8. Implement Retry Logic

```typescript
export default defineConfig({
  retries: process.env.CI ? 2 : 0,
  // Retry failed tests in CI
});
```

### 9. Clean Up Old Test Runs

- Regularly delete old test runs in Azure Portal
- Set up retention policies
- Archive important test results

### 10. Use Environment-Specific Configurations

```typescript
// Different config for staging vs production
const isStaging = process.env.NODE_ENV === 'staging';
const workers = isStaging ? 20 : 10;
```

## Azure Regions

| Region | Service URL |
|--------|-------------|
| East US | `https://eastus.api.playwright.microsoft.com` |
| West US | `https://westus.api.playwright.microsoft.com` |
| West Europe | `https://westeurope.api.playwright.microsoft.com` |
| UK South | `https://uksouth.api.playwright.microsoft.com` |
| Australia East | `https://australiaeast.api.playwright.microsoft.com` |

## Pricing Information

Azure Playwright Testing charges based on:
- **Test minutes**: Pay per minute of test execution
- **Storage**: For storing test results, videos, traces
- **Data transfer**: Minimal charges for data egress

**Cost Optimization Tips:**
- Use parallelization efficiently
- Minimize test execution time
- Clean up old test results
- Use traces only when needed

**Pricing Calculator:**
[Azure Pricing Calculator](https://azure.microsoft.com/en-us/pricing/calculator/)

## Additional Resources

- [Official Documentation](https://learn.microsoft.com/en-us/azure/playwright-testing/)
- [Quickstart Guide](https://learn.microsoft.com/en-us/azure/playwright-testing/quickstart-run-end-to-end-tests)
- [Configuration Reference](https://learn.microsoft.com/en-us/azure/playwright-testing/how-to-use-service-config-file)
- [Azure Portal](https://portal.azure.com/)
- [Azure CLI Documentation](https://learn.microsoft.com/en-us/cli/azure/)
- [Playwright Documentation](https://playwright.dev/)

## Support

- **Azure Support**: [Azure Support Portal](https://azure.microsoft.com/en-us/support/)
- **Community**: [Playwright Discord](https://discord.com/invite/playwright-807756831384403968)
- **GitHub Issues**: [Playwright GitHub](https://github.com/microsoft/playwright)

---

**Last Updated:** October 2024

