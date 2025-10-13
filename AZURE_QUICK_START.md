# Azure Playwright Testing - Quick Start Guide

Get your tests running on Azure Playwright Testing in under 5 minutes!

## Quick Setup Steps

### 1. Create Azure Workspace (5 minutes)

1. Go to [Azure Portal](https://portal.azure.com/)
2. Search for "Playwright Testing" → Click "Create"
3. Fill in:
   - Name: `my-playwright-workspace`
   - Region: Choose closest (East US, West Europe, etc.)
   - Subscription: Your Azure subscription
4. Click "Create" and wait ~2 minutes
5. Copy your **Service URL** and generate an **Access Token**

### 2. Configure Environment (30 seconds)

**PowerShell:**
```powershell
$env:PLAYWRIGHT_SERVICE_URL="https://eastus.api.playwright.microsoft.com"
$env:PLAYWRIGHT_SERVICE_ACCESS_TOKEN="your-access-token-here"
```

**Bash/Linux:**
```bash
export PLAYWRIGHT_SERVICE_URL=https://eastus.api.playwright.microsoft.com
export PLAYWRIGHT_SERVICE_ACCESS_TOKEN=your-access-token-here
```

Or add to your `.env` file:
```bash
PLAYWRIGHT_SERVICE_URL=https://eastus.api.playwright.microsoft.com
PLAYWRIGHT_SERVICE_ACCESS_TOKEN=your-access-token-here
```

### 3. Run Your Tests (10 seconds)

```bash
# Run all tests on Azure
npm run test:azure

# Run smoke tests
npm run test:azure:smoke

# Run critical tests
npm run test:azure:critical
```

## That's It! 🎉

Your tests are now running on Azure cloud browsers with:
- ✅ Up to 20+ parallel workers
- ✅ Faster execution
- ✅ Scalable infrastructure
- ✅ Comprehensive reporting

## View Results

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to your Playwright Testing workspace
3. Click "Test Runs" to see results, videos, and traces

## Available Commands

```bash
# Basic commands
npm run test:azure                 # Run all tests
npm run test:azure:smoke          # Run @smoke tests
npm run test:azure:critical       # Run @critical tests
npm run test:azure:tags           # Run @smoke and @critical

# Browser-specific
npm run test:azure:chromium       # Chromium only
npm run test:azure:firefox        # Firefox only
npm run test:azure:webkit         # WebKit (Safari) only

# Advanced
npx playwright test -c playwright.azure.config.ts --grep "@smoke"
npx playwright test -c playwright.azure.config.ts test/specs/login.spec.ts
npx playwright test -c playwright.azure.config.ts --workers=30
```

## Azure Regions

| Region | Service URL |
|--------|-------------|
| **East US** | `https://eastus.api.playwright.microsoft.com` |
| **West US** | `https://westus.api.playwright.microsoft.com` |
| **West Europe** | `https://westeurope.api.playwright.microsoft.com` |
| **UK South** | `https://uksouth.api.playwright.microsoft.com` |
| **Australia East** | `https://australiaeast.api.playwright.microsoft.com` |

Choose the region **closest to your application** for best performance.

## Authentication Options

### Option 1: Access Token (Recommended for Getting Started)
```bash
export PLAYWRIGHT_SERVICE_URL=https://eastus.api.playwright.microsoft.com
export PLAYWRIGHT_SERVICE_ACCESS_TOKEN=your-token
```

### Option 2: Entra ID (Recommended for Production)
```bash
az login
export PLAYWRIGHT_SERVICE_URL=https://eastus.api.playwright.microsoft.com
export PLAYWRIGHT_SERVICE_AUTH_TYPE=ENTRA_ID
```

## Troubleshooting

### Tests run locally instead of Azure?
- Verify `PLAYWRIGHT_SERVICE_URL` is set: `echo $PLAYWRIGHT_SERVICE_URL`
- Check your access token hasn't expired

### Authentication failed?
- Generate a new access token in Azure Portal
- Or re-login: `az login`

### Need more help?
See detailed documentation:
- [docs/AZURE_PLAYWRIGHT_SETUP.md](docs/AZURE_PLAYWRIGHT_SETUP.md) - Complete setup guide
- [README.md](README.md) - Full framework documentation

## Benefits of Azure Playwright Testing

### Scalability
- Run 20-50+ tests in parallel
- Much faster than local execution
- No local resource constraints

### Reliability
- Enterprise-grade infrastructure
- Consistent browser environments
- Reduced flakiness

### Features
- Built-in video recording
- Trace viewer
- Screenshot capture
- Detailed test reports
- Integration with Azure DevOps

### Cost-Effective
- Pay only for test minutes used
- No infrastructure maintenance
- Scale up/down as needed

## Next Steps

1. **Optimize parallelization**: Increase workers in `playwright.azure.config.ts`
2. **Add more tests**: Tag tests with `@smoke`, `@critical` for filtering
3. **CI/CD Integration**: Add to your pipeline (GitHub Actions, Azure DevOps)
4. **Monitor costs**: Set up cost alerts in Azure Portal
5. **Review best practices**: See [docs/AZURE_PLAYWRIGHT_SETUP.md](docs/AZURE_PLAYWRIGHT_SETUP.md)

## Example Test Run

```bash
# Full workflow example
$env:PLAYWRIGHT_SERVICE_URL="https://eastus.api.playwright.microsoft.com"
$env:PLAYWRIGHT_SERVICE_ACCESS_TOKEN="abc123xyz..."
npm run test:azure:smoke

# Output:
# Running 15 tests using 20 workers
# ✓ Login test @smoke (2.3s)
# ✓ Search test @smoke (1.8s)
# ...
# 15 passed (12.4s)
#
# View results: https://portal.azure.com/...
```

## Support

- **Documentation**: [Azure Playwright Testing Docs](https://learn.microsoft.com/en-us/azure/playwright-testing/)
- **Azure Portal**: [portal.azure.com](https://portal.azure.com/)
- **Community**: [Playwright Discord](https://discord.com/invite/playwright-807756831384403968)

---

**Ready to scale your testing? Start running tests on Azure now!** 🚀

