# Azure Playwright Testing Troubleshooting Guide

## Problem: Tests show 00:00:00 duration and don't execute

### Root Causes Identified:
1. **Authentication Issues**: Access token expired or invalid
2. **Azure CLI Not in PATH**: CLI installed but not accessible
3. **Configuration Problems**: WebSocket connection issues
4. **Package Compatibility**: Azure Playwright package issues

## Solutions

### Solution 1: Get Fresh Access Token (Recommended)

1. **Install Azure CLI** (if not already installed):
   ```bash
   winget install Microsoft.AzureCLI
   ```

2. **Login to Azure**:
   ```bash
   az login
   ```

3. **Get fresh token**:
   ```bash
   npm run azure:token
   ```

4. **Test Azure connection**:
   ```bash
   npm run test:azure:service -- --dry-run
   ```

### Solution 2: Manual Token Generation

If the script doesn't work, manually get a token:

1. **Login to Azure**:
   ```bash
   az login
   ```

2. **Get access token**:
   ```bash
   az account get-access-token --resource "https://playwright.microsoft.com"
   ```

3. **Update .env file** with the new token:
   ```
   PLAYWRIGHT_SERVICE_ACCESS_TOKEN=your-new-token-here
   ```

### Solution 3: Use Azure Portal

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to your Playwright Testing workspace
3. Go to **Settings** → **Access tokens**
4. Generate a new token
5. Update your `.env` file

### Solution 4: Alternative Configuration

If Azure Playwright package continues to have issues, use the simplified configuration:

```typescript
// playwright.service.config.ts
export default defineConfig({
  ...config,
  use: {
    ...config.use,
    connectOptions: {
      wsEndpoint: `${process.env.PLAYWRIGHT_SERVICE_URL}/playwright`,
      headers: {
        'Authorization': `Bearer ${process.env.PLAYWRIGHT_SERVICE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      timeout: 60000,
      retries: 3
    }
  }
});
```

## Testing Your Setup

### 1. Test Local Execution First
```bash
npm run test:local -- --dry-run
```

### 2. Test Azure Connection
```bash
npm run test:azure:service -- --dry-run
```

### 3. Run Actual Azure Tests
```bash
npm run test:azure:smoke
```

## Common Issues and Fixes

### Issue: "Unexpected status 500"
- **Cause**: Invalid or expired access token
- **Fix**: Generate a new access token using `npm run azure:token`

### Issue: "Worker process exited unexpectedly"
- **Cause**: Azure connection timeout or authentication failure
- **Fix**: Check your network connection and token validity

### Issue: "This does not look like a Playwright server"
- **Cause**: Incorrect WebSocket endpoint URL
- **Fix**: Verify your `PLAYWRIGHT_SERVICE_URL` format

### Issue: Azure CLI not found
- **Cause**: Azure CLI not in PATH
- **Fix**: Restart your terminal or add Azure CLI to PATH manually

## Verification Steps

1. **Check environment variables**:
   ```bash
   echo $env:PLAYWRIGHT_SERVICE_URL
   echo $env:PLAYWRIGHT_SERVICE_ACCESS_TOKEN
   ```

2. **Test Azure CLI**:
   ```bash
   az --version
   az account show
   ```

3. **Check token validity**:
   ```bash
   az account get-access-token --resource "https://playwright.microsoft.com"
   ```

## Expected Behavior After Fix

- Tests should show actual duration (not 00:00:00)
- Max Concurrent Sessions should show > 0
- Status should show "Success" or "Failed" (not stuck in "Running")
- Test results should appear in Azure portal

## Next Steps

Once your Azure setup is working:

1. **Run smoke tests**: `npm run test:azure:smoke`
2. **Run critical tests**: `npm run test:azure:critical`
3. **Run all tests**: `npm run test:azure`
4. **Check Azure portal** for test results and reports

## Support

If issues persist:
1. Check Azure Playwright Testing documentation
2. Verify your Azure subscription has Playwright Testing enabled
3. Contact Azure support for workspace-specific issues
