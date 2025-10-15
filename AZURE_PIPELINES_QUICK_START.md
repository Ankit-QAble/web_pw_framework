# Azure Pipelines Quick Start Guide

Quick reference for setting up and using Azure Pipelines with your Playwright framework.

## 🚀 Quick Setup (5 Minutes)

### 1. Create Pipeline
```bash
# In Azure DevOps:
1. Go to Pipelines → New Pipeline
2. Select your repository
3. Choose "Existing Azure Pipelines YAML file"
4. Select: /azure-pipelines.yml
5. Click "Run"
```

### 2. Configure Variables
```bash
# In Pipeline → Edit → Variables, add:
NODE_VERSION = 20.x
CI = true
```

### 3. (Optional) Add Azure Cloud Testing
```bash
# For cloud browser testing, add:
PLAYWRIGHT_SERVICE_URL = your-service-url
PLAYWRIGHT_SERVICE_ACCESS_TOKEN = your-token (mark as secret)
```

---

## 📊 Pipeline Stages

| Stage | Description | Duration | Browsers |
|-------|-------------|----------|----------|
| **Setup** | Install dependencies | ~2 min | - |
| **Smoke Tests** | Run @smoke tagged tests | ~5 min | All |
| **Critical Tests** | Run @critical tagged tests | ~3 min | Chromium |
| **Full Tests** | Run all tests | ~10 min | All |
| **Generate Reports** | Create Allure report | ~1 min | - |
| **Azure Cloud** | Run on Azure cloud browsers | ~5 min | All |

**Total Time**: ~15-20 minutes (stages run in parallel)

---

## 🏃 Running Tests

### Automatic Triggers
- **Push** to `main`, `develop`, `feature/*`
- **Pull Request** to `main`, `develop`

### Manual Run
```bash
Pipelines → Your Pipeline → Run Pipeline → Run
```

### Run Specific Tests Locally
```bash
# Smoke tests
npx playwright test --grep="@smoke"

# Critical tests
npx playwright test --grep="@critical"

# Azure cloud tests
npm run test:azure
```

---

## 📈 Viewing Results

### 1. Test Results (Built-in)
```
Pipeline Run → Tests Tab
```

### 2. Playwright HTML Report
```
Pipeline Run → Artifacts → playwright-report-* → Download → Open index.html
```

### 3. Allure Report
```
Pipeline Run → Artifacts → allure-report → Download → Open index.html
```

### 4. Screenshots
```
Pipeline Run → Artifacts → screenshots-* → Download
```

---

## 🔧 Common Configurations

### Add Environment Variables
```yaml
# In azure-pipelines.yml, under script:
env:
  BASE_URL: $(BASE_URL)
  TEST_USERNAME: $(TEST_USERNAME)
  TEST_PASSWORD: $(TEST_PASSWORD)
```

### Schedule Daily Runs
```yaml
# Add to azure-pipelines.yml:
schedules:
  - cron: "0 2 * * *"  # 2 AM daily
    displayName: 'Nightly Tests'
    branches:
      include:
        - main
```

### Run on Windows
```yaml
# Change pool:
pool:
  vmImage: 'windows-latest'
```

### Run on macOS
```yaml
# Change pool:
pool:
  vmImage: 'macos-latest'
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| **Browsers not found** | Add: `npx playwright install --with-deps` |
| **Tests timeout** | Increase timeout in playwright config |
| **Variables not loading** | Check variable is set in pipeline settings |
| **Artifacts not publishing** | Add `condition: always()` to publish task |
| **Cache not working** | Verify cache key matches package-lock.json |

---

## 📝 Pipeline Variables Reference

### Required
```
NODE_VERSION = 20.x
CI = true
```

### Optional (Azure Cloud)
```
PLAYWRIGHT_SERVICE_URL = https://<region>.api.playwright.microsoft.com/...
PLAYWRIGHT_SERVICE_ACCESS_TOKEN = ********
```

### Your App Variables
```
BASE_URL = https://your-app.com
TEST_USERNAME = testuser@example.com
TEST_PASSWORD = ******** (mark as secret!)
```

---

## 🎯 Test Tags

Organize tests with tags:

```typescript
// In your test files:
test('@smoke Login page loads', async ({ page }) => {
  // Smoke test
});

test('@critical User can login', async ({ page }) => {
  // Critical test
});

test('@regression Full user journey', async ({ page }) => {
  // Regression test
});
```

Run specific tags:
```bash
npx playwright test --grep="@smoke"
npx playwright test --grep="@critical"
npx playwright test --grep="@smoke|@critical"
```

---

## 📧 Email Notifications

Setup in Azure DevOps:
```
Project Settings → Notifications → New Subscription
→ Build Failed → Add recipients
```

---

## 🔗 Useful Links

- **Azure Pipelines**: [Pipelines Dashboard](https://dev.azure.com)
- **Playwright Docs**: https://playwright.dev
- **Allure Docs**: https://docs.qameta.io/allure/
- **Full Setup Guide**: See `docs/AZURE_PIPELINES_SETUP.md`

---

## 💡 Pro Tips

1. **Cache Dependencies**: Already configured - saves ~1-2 minutes per run
2. **Parallel Testing**: Enabled by default - runs 3 browsers simultaneously
3. **Fail Fast**: Tests continue even if some fail - see all results
4. **Artifact Retention**: Configure in Project Settings → Pipelines → Retention
5. **Badge**: Add pipeline badge to README for status visibility

---

## 🎨 Add Status Badge to README

```markdown
[![Build Status](https://dev.azure.com/{organization}/{project}/_apis/build/status/{pipeline-name}?branchName=main)](https://dev.azure.com/{organization}/{project}/_build/latest?definitionId={pipeline-id}&branchName=main)
```

Get the badge URL:
```
Pipeline → ⋯ (menu) → Status Badge → Copy markdown
```

---

## 🚨 Quick Commands

```bash
# Install everything
npm ci && npx playwright install --with-deps

# Run smoke tests locally
npx playwright test --grep="@smoke"

# Run with Azure config
npm run test:azure

# Generate report
npx allure generate allure-results --clean
npx allure open allure-report

# View HTML report
npx playwright show-report

# Debug specific test
npx playwright test login.spec.ts --debug

# Run in headed mode
npx playwright test --headed

# Run on specific browser
npx playwright test --project=chromium
```

---

## ✅ Checklist

- [ ] Pipeline created in Azure DevOps
- [ ] `azure-pipelines.yml` committed to repo
- [ ] Required variables configured
- [ ] First pipeline run successful
- [ ] Test results visible in Tests tab
- [ ] Artifacts publishing correctly
- [ ] (Optional) Azure Cloud Testing configured
- [ ] (Optional) Email notifications setup
- [ ] (Optional) Status badge added to README

---

**Need Help?** Check the full guide at `docs/AZURE_PIPELINES_SETUP.md`

**Last Updated**: October 2025

