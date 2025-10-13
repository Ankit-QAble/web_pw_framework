# GitHub Actions Quick Reference Guide

Quick commands and configurations for GitHub Actions workflows.

## 🚀 Quick Start

### 1. Set Up Secrets (5 minutes)

Go to **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

```
LambdaTest:
  LT_USERNAME: your-username
  LT_ACCESS_KEY: your-access-key

BrowserStack:
  BROWSERSTACK_USERNAME: your-username
  BROWSERSTACK_ACCESS_KEY: your-access-key

Azure:
  PLAYWRIGHT_SERVICE_URL: https://eastus.api.playwright.microsoft.com
  PLAYWRIGHT_SERVICE_ACCESS_TOKEN: your-token
```

### 2. Push Workflows to GitHub

```bash
git add .github/workflows/
git commit -m "Add GitHub Actions workflows"
git push origin main
```

### 3. Run Your First Workflow

Go to **Actions** tab → **Manual Test Execution** → **Run workflow**

## 📊 Available Workflows

| Workflow | Trigger | Purpose |
|----------|---------|---------|
| **Playwright Tests CI** | Push, PR, Manual | Main CI pipeline |
| **LambdaTest Tests** | Push, PR, Daily 2AM, Manual | LambdaTest cloud tests |
| **BrowserStack Tests** | Push, PR, Daily 3AM, Manual | BrowserStack cloud tests |
| **Azure Playwright** | Push, PR, Daily 4AM, Manual | Azure cloud tests |
| **Nightly Regression** | Daily 12AM, Manual | Full regression suite |
| **Manual Execution** | Manual only | On-demand tests |

## ⚡ Quick Commands

### Via GitHub CLI

```bash
# Install GitHub CLI
brew install gh  # macOS
winget install GitHub.cli  # Windows

# Authenticate
gh auth login

# Run workflows
gh workflow run "Manual Test Execution" \
  --field cloud_provider=lambdatest \
  --field test_tags="@smoke" \
  --field browser=chromium \
  --field environment=staging

gh workflow run "Azure Playwright Testing" \
  --field test_tags="@smoke|@critical" \
  --field workers=20

# List workflow runs
gh run list

# View specific run
gh run view <run-id>

# Download artifacts
gh run download <run-id>
```

### View Results

```bash
# Open workflow runs
gh run list --web

# Download and view Allure report
gh run download <run-id> --name allure-report
cd allure-report
npx http-server
```

## 🔑 Required Secrets by Workflow

| Workflow | Required Secrets |
|----------|-----------------|
| Playwright Tests CI | None (runs locally) |
| LambdaTest Tests | `LT_USERNAME`, `LT_ACCESS_KEY` |
| BrowserStack Tests | `BROWSERSTACK_USERNAME`, `BROWSERSTACK_ACCESS_KEY` |
| Azure Playwright | `PLAYWRIGHT_SERVICE_URL`, `PLAYWRIGHT_SERVICE_ACCESS_TOKEN` |
| Nightly Regression | None (runs locally) |
| Manual Execution | Depends on chosen cloud provider |

## 🎯 Common Use Cases

### Run Smoke Tests on LambdaTest

**Via UI:**
1. Actions → LambdaTest Cloud Tests → Run workflow
2. Test tags: `@smoke`
3. Run workflow

**Via CLI:**
```bash
gh workflow run "LambdaTest Cloud Tests" --field test_tags="@smoke"
```

### Run Full Regression

**Via UI:**
1. Actions → Nightly Regression Tests → Run workflow
2. Environment: staging
3. Run workflow

**Via CLI:**
```bash
gh workflow run "Nightly Regression Tests" --field environment=staging
```

### Run Tests on Multiple Browsers

**Via UI:**
1. Actions → Manual Test Execution → Run workflow
2. Cloud provider: azure
3. Browser: all
4. Test tags: @smoke
5. Workers: 20

**Via CLI:**
```bash
gh workflow run "Manual Test Execution" \
  --field cloud_provider=azure \
  --field browser=all \
  --field test_tags="@smoke" \
  --field workers=20
```

## 📈 Viewing Results

### GitHub Actions UI

```
Repository → Actions → Select Run → View Details
```

**What you'll see:**
- ✅ Job status
- 📊 Test summary
- 📦 Artifacts (reports, screenshots, videos)
- 📝 Logs

### Download Reports

```bash
# List artifacts
gh run view <run-id>

# Download all artifacts
gh run download <run-id>

# Download specific artifact
gh run download <run-id> --name playwright-results-chromium
```

### View Locally

```bash
# HTML Report
cd playwright-results-chromium
open playwright-report/index.html  # macOS
start playwright-report/index.html  # Windows

# Allure Report
cd allure-report
npx http-server
# Open http://localhost:8080
```

## 🛠️ Troubleshooting Quick Fixes

### Tests Failing?

```bash
# Check logs
gh run view <run-id> --log

# Re-run failed jobs
gh run rerun <run-id> --failed
```

### Secrets Not Working?

```bash
# Verify secrets are set
gh secret list

# Set/update secret
gh secret set LT_USERNAME
# Paste value when prompted

gh secret set BROWSERSTACK_ACCESS_KEY < secret.txt
```

### Workflow Not Showing?

```bash
# List all workflows
gh workflow list

# Enable workflow
gh workflow enable "Playwright Tests CI"

# View workflow file
gh workflow view "Playwright Tests CI"
```

## 📊 Workflow Status Badges

Add to your README.md:

```markdown
# Playwright Tests CI
![Playwright Tests](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/playwright-tests.yml/badge.svg)

# LambdaTest
![LambdaTest Tests](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/lambdatest-tests.yml/badge.svg)

# BrowserStack
![BrowserStack Tests](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/browserstack-tests.yml/badge.svg)

# Azure
![Azure Tests](https://github.com/YOUR_USERNAME/YOUR_REPO/actions/workflows/azure-playwright-tests.yml/badge.svg)
```

## 🔄 Workflow Parameters Reference

### Manual Test Execution

| Parameter | Options | Default |
|-----------|---------|---------|
| cloud_provider | local, lambdatest, browserstack, azure | - |
| test_tags | Any grep pattern | @smoke |
| browser | chromium, firefox, webkit, all | - |
| environment | development, staging, production | - |
| workers | 1-50 | 5 |

### Azure Playwright Testing

| Parameter | Options | Default |
|-----------|---------|---------|
| test_tags | Any grep pattern | @smoke\|@critical |
| workers | 1-50 | 20 |

### Playwright Tests CI

| Parameter | Options | Default |
|-----------|---------|---------|
| environment | development, staging, production | staging |
| test_tags | Any grep pattern | @smoke |

## 📅 Schedule Reference

```yaml
# Every day at midnight
- cron: '0 0 * * *'

# Every day at 2 AM
- cron: '0 2 * * *'

# Every weekday at 9 AM
- cron: '0 9 * * 1-5'

# Every Monday at 6 AM
- cron: '0 6 * * 1'

# Every hour
- cron: '0 * * * *'
```

## 🎨 Customization Examples

### Change Test Command

```yaml
# In workflow file
- name: Run tests
  run: npx playwright test --grep "@smoke" --retries=2
```

### Add Slack Notification

```yaml
- name: Notify Slack
  uses: slackapi/slack-github-action@v1
  with:
    payload: '{"text":"Tests completed"}'
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

### Deploy Reports to GitHub Pages

```yaml
- name: Deploy report
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./allure-report
```

## 🔗 Quick Links

- **Actions Documentation:** https://docs.github.com/en/actions
- **Playwright CI Guide:** https://playwright.dev/docs/ci
- **GitHub CLI:** https://cli.github.com/
- **LambdaTest Dashboard:** https://automation.lambdatest.com/
- **BrowserStack Dashboard:** https://automate.browserstack.com/
- **Azure Portal:** https://portal.azure.com/

## 📞 Getting Help

```bash
# GitHub CLI help
gh workflow --help
gh run --help
gh secret --help

# View workflow syntax
gh workflow view "Playwright Tests CI"

# Check workflow runs
gh run list --workflow="Playwright Tests CI"
```

## ✅ Checklist

- [ ] Workflows pushed to `.github/workflows/`
- [ ] Secrets configured in repository settings
- [ ] First manual test run successful
- [ ] Test artifacts downloadable
- [ ] Cloud dashboards accessible (if using cloud providers)
- [ ] Status badges added to README (optional)
- [ ] Team members notified about CI setup

---

**Need detailed setup?** See [`docs/GITHUB_ACTIONS_SETUP.md`](docs/GITHUB_ACTIONS_SETUP.md)

