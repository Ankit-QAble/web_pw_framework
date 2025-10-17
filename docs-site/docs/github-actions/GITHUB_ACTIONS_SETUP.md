# GitHub Actions Setup Guide

Complete guide for setting up and using GitHub Actions CI/CD workflows for your Playwright test automation framework.

## 📋 Table of Contents

- [Overview](#overview)
- [Available Workflows](#available-workflows)
- [Setup Instructions](#setup-instructions)
- [Configuring Secrets](#configuring-secrets)
- [Running Workflows](#running-workflows)
- [Viewing Results](#viewing-results)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This project includes 6 comprehensive GitHub Actions workflows:

1. **Playwright Tests CI** - Main CI/CD pipeline
2. **LambdaTest Cloud Tests** - Tests on LambdaTest
3. **BrowserStack Cloud Tests** - Tests on BrowserStack
4. **Azure Playwright Testing** - Tests on Azure
5. **Nightly Regression** - Scheduled full regression
6. **Manual Test Execution** - On-demand test runs

## 📊 Available Workflows

### 1. Playwright Tests CI (`playwright-tests.yml`)

**Triggers:**
- Push to `main`, `develop`, `staging` branches
- Pull requests to `main`, `develop`
- Manual dispatch with custom parameters

**Features:**
- Multi-browser testing (Chromium, Firefox, WebKit)
- Parallel execution
- Test result artifacts
- Allure report generation
- PR comments with results

**Manual Run Parameters:**
- Environment: development, staging, production
- Test tags: @smoke, @critical, etc.

### 2. LambdaTest Cloud Tests (`lambdatest-tests.yml`)

**Triggers:**
- Push to `main`, `develop`
- Pull requests to `main`
- Daily at 2 AM UTC
- Manual dispatch

**Features:**
- Runs on LambdaTest cloud browsers
- Smoke and critical test execution
- LambdaTest dashboard integration

### 3. BrowserStack Cloud Tests (`browserstack-tests.yml`)

**Triggers:**
- Push to `main`, `develop`
- Pull requests to `main`
- Daily at 3 AM UTC
- Manual dispatch

**Features:**
- Runs on BrowserStack cloud browsers
- Configurable test tags
- BrowserStack dashboard integration

### 4. Azure Playwright Testing (`azure-playwright-tests.yml`)

**Triggers:**
- Push to `main`, `develop`
- Pull requests to `main`
- Daily at 4 AM UTC
- Manual dispatch

**Features:**
- Runs on Azure Playwright Testing service
- Configurable parallel workers (default: 20)
- Azure Portal integration

**Manual Run Parameters:**
- Test tags
- Number of workers (1-50)

### 5. Nightly Regression (`nightly-regression.yml`)

**Triggers:**
- Daily at midnight UTC
- Manual dispatch

**Features:**
- Full test suite execution
- Multi-browser testing
- Sharded execution (4 shards per browser)
- Merged reports
- Notification on completion

### 6. Manual Test Execution (`manual-test-run.yml`)

**Triggers:**
- Manual dispatch only

**Features:**
- Choose cloud provider (local, LambdaTest, BrowserStack, Azure)
- Choose browser (Chromium, Firefox, WebKit, All)
- Choose environment (development, staging, production)
- Custom test tags
- Configurable workers

## 🛠️ Setup Instructions

### Step 1: Push Workflows to GitHub

The workflows are already created in `.github/workflows/`. Push them to your repository:

```bash
git add .github/workflows/
git commit -m "Add GitHub Actions workflows"
git push origin main
```

### Step 2: Configure Repository Secrets

Go to your GitHub repository:
1. Click **Settings**
2. Click **Secrets and variables** → **Actions**
3. Click **New repository secret**

Add the following secrets:

#### For LambdaTest:
| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `LT_USERNAME` | Your LambdaTest username | LambdaTest Dashboard → Profile |
| `LT_ACCESS_KEY` | Your LambdaTest access key | LambdaTest Dashboard → Access Key |

#### For BrowserStack:
| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `BROWSERSTACK_USERNAME` | Your BrowserStack username | BrowserStack Dashboard → Account |
| `BROWSERSTACK_ACCESS_KEY` | Your BrowserStack access key | BrowserStack Dashboard → Access Key |

#### For Azure Playwright Testing:
| Secret Name | Description | How to Get |
|-------------|-------------|------------|
| `PLAYWRIGHT_SERVICE_URL` | Azure service URL | Azure Portal → Your Workspace → Overview |
| `PLAYWRIGHT_SERVICE_ACCESS_TOKEN` | Azure access token | Azure Portal → Your Workspace → Settings → Access tokens |
| `AZURE_CREDENTIALS` | Azure credentials JSON | Azure Portal → Service Principal |

#### For Email Notifications (Optional):
| Secret Name | Description |
|-------------|-------------|
| `SMTP_USER` | Email username |
| `SMTP_PASS` | Email password or app password |
| `EMAIL_TO` | Recipient email addresses |

### Step 3: Enable Workflows

1. Go to **Actions** tab in your repository
2. You should see all 6 workflows listed
3. Enable any disabled workflows

## 🔐 Configuring Secrets

### LambdaTest Secrets

1. **Get Credentials:**
   - Go to [LambdaTest Dashboard](https://automation.lambdatest.com/)
   - Click your profile → Profile
   - Copy Username and Access Key

2. **Add to GitHub:**
   ```
   LT_USERNAME: your-username
   LT_ACCESS_KEY: your-access-key
   ```

### BrowserStack Secrets

1. **Get Credentials:**
   - Go to [BrowserStack Dashboard](https://automate.browserstack.com/)
   - Click Access Key
   - Copy Username and Access Key

2. **Add to GitHub:**
   ```
   BROWSERSTACK_USERNAME: your-username
   BROWSERSTACK_ACCESS_KEY: your-access-key
   ```

### Azure Playwright Testing Secrets

1. **Get Service URL:**
   - Azure Portal → Your Playwright Testing Workspace
   - Copy the Service URL (e.g., `https://eastus.api.playwright.microsoft.com`)

2. **Generate Access Token:**
   - Azure Portal → Your Workspace → Settings → Access tokens
   - Click "Generate new token"
   - Copy the token

3. **Add to GitHub:**
   ```
   PLAYWRIGHT_SERVICE_URL: https://eastus.api.playwright.microsoft.com
   PLAYWRIGHT_SERVICE_ACCESS_TOKEN: your-token-here
   ```

4. **Azure Credentials (for Azure Login):**
   ```bash
   # Create service principal
   az ad sp create-for-rbac --name "playwright-testing-sp" --role contributor \
     --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group} \
     --sdk-auth
   ```
   Copy the entire JSON output and save as `AZURE_CREDENTIALS` secret.

## ▶️ Running Workflows

### Automatic Triggers

Workflows run automatically on:
- **Push to main/develop:** Runs Playwright Tests CI
- **Pull Requests:** Runs tests and comments results on PR
- **Scheduled:**
  - LambdaTest: Daily at 2 AM UTC
  - BrowserStack: Daily at 3 AM UTC
  - Azure: Daily at 4 AM UTC
  - Nightly Regression: Daily at midnight UTC

### Manual Execution

#### 1. Via GitHub UI:

1. Go to **Actions** tab
2. Select a workflow (e.g., "Manual Test Execution")
3. Click **Run workflow**
4. Fill in the parameters
5. Click **Run workflow**

#### 2. Via GitHub CLI:

```bash
# Install GitHub CLI
brew install gh  # macOS
# or download from https://cli.github.com/

# Authenticate
gh auth login

# Run Manual Test Execution
gh workflow run "Manual Test Execution" \
  --field cloud_provider=lambdatest \
  --field test_tags="@smoke" \
  --field browser=chromium \
  --field environment=staging \
  --field workers=5

# Run Azure tests
gh workflow run "Azure Playwright Testing" \
  --field test_tags="@smoke|@critical" \
  --field workers=20

# Run nightly regression
gh workflow run "Nightly Regression Tests" \
  --field environment=staging
```

## 📊 Viewing Results

### 1. GitHub Actions UI

1. Go to **Actions** tab
2. Click on a workflow run
3. View:
   - Summary page with job status
   - Job logs
   - Artifacts (test reports, screenshots, videos)

### 2. Artifacts

Download artifacts:
1. Go to workflow run
2. Scroll to **Artifacts** section at the bottom
3. Download:
   - `playwright-results` - HTML reports
   - `allure-report` - Allure reports
   - `screenshots` - Test screenshots
   - `test-results` - Raw test results

### 3. View Allure Report

```bash
# Download artifact
gh run download <run-id> --name allure-report-lambdatest

# Serve locally
cd allure-report-lambdatest
npx http-server
# Open http://localhost:8080
```

### 4. Cloud Dashboards

- **LambdaTest:** https://automation.lambdatest.com/
- **BrowserStack:** https://automate.browserstack.com/
- **Azure:** https://portal.azure.com/

### 5. Pull Request Comments

For PR workflows, results are automatically commented on the PR with:
- Test status
- Link to full results
- Artifact links

## 🔧 Customization

### Modify Workflows

Edit workflow files in `.github/workflows/`:

```yaml
# Change Node.js version
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '20'  # Change to 20

# Change schedule
on:
  schedule:
    - cron: '0 6 * * *'  # Run at 6 AM UTC

# Add more browsers
strategy:
  matrix:
    browser: [chromium, firefox, webkit, 'Google Chrome', 'Microsoft Edge']

# Change retention days
- uses: actions/upload-artifact@v4
  with:
    retention-days: 60  # Keep for 60 days
```

### Add Custom Steps

```yaml
# Add Slack notification
- name: 📢 Slack Notification
  uses: rtCamp/action-slack-notify@v2
  env:
    SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
    SLACK_MESSAGE: 'Tests completed!'

# Add database seeding
- name: 🌱 Seed test data
  run: npm run seed:test-data

# Add environment health check
- name: 🏥 Health check
  run: curl -f ${{ secrets.BASE_URL }}/health || exit 1
```

## 🐛 Troubleshooting

### Issue 1: Secrets Not Found

**Error:**
```
Error: Input required and not supplied: BROWSERSTACK_USERNAME
```

**Solution:**
1. Verify secret names match exactly (case-sensitive)
2. Check secrets are set in repository settings
3. Secrets are not available in forked repository PRs (security)

### Issue 2: Playwright Installation Fails

**Error:**
```
Error: Failed to install browsers
```

**Solution:**
```yaml
# Use --with-deps flag
- name: Install Playwright
  run: npx playwright install --with-deps

# Or install specific browsers
- name: Install Playwright
  run: npx playwright install chromium --with-deps
```

### Issue 3: Tests Timeout

**Error:**
```
Error: Test timeout exceeded
```

**Solution:**
```yaml
# Increase job timeout
jobs:
  test:
    timeout-minutes: 120  # Increase from 60

# Increase test timeout in config
timeout: 120000  # 2 minutes
```

### Issue 4: Azure Authentication Failed

**Error:**
```
Error: Unable to authenticate with Azure
```

**Solution:**
1. Verify `PLAYWRIGHT_SERVICE_URL` is correct
2. Check `PLAYWRIGHT_SERVICE_ACCESS_TOKEN` hasn't expired
3. Regenerate token if needed
4. Ensure Azure credentials JSON is valid

### Issue 5: Artifacts Not Uploading

**Error:**
```
Warning: No files were found with the provided path
```

**Solution:**
```yaml
# Check paths exist
- name: Upload artifacts
  uses: actions/upload-artifact@v4
  if: always()  # Always upload, even on failure
  with:
    path: |
      playwright-report/
      test-results/
    if-no-files-found: warn  # Don't fail if no files
```

## 📈 Best Practices

### 1. Use Matrix Strategy

Run tests in parallel across browsers:
```yaml
strategy:
  fail-fast: false
  matrix:
    browser: [chromium, firefox, webkit]
    os: [ubuntu-latest, windows-latest, macos-latest]
```

### 2. Cache Dependencies

Speed up workflows:
```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'

- uses: actions/cache@v3
  with:
    path: ~/.cache/ms-playwright
    key: ${{ runner.os }}-playwright-${{ hashFiles('package-lock.json') }}
```

### 3. Use Concurrency Control

Prevent multiple runs:
```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

### 4. Tag-Based Execution

Run different test suites:
```yaml
# Smoke tests on every PR
- name: Run smoke tests
  if: github.event_name == 'pull_request'
  run: npm run test -- --grep "@smoke"

# Full tests on main
- name: Run all tests
  if: github.ref == 'refs/heads/main'
  run: npm test
```

### 5. Conditional Steps

```yaml
# Only on main branch
- name: Deploy report
  if: github.ref == 'refs/heads/main'
  run: npm run deploy:report

# Only on failure
- name: Debug info
  if: failure()
  run: |
    docker logs
    cat playwright-report/index.html
```

## 🚀 Advanced Configuration

### Sharding for Faster Execution

```yaml
strategy:
  matrix:
    shard: [1/3, 2/3, 3/3]
steps:
  - name: Run tests
    run: npx playwright test --shard=${{ matrix.shard }}
```

### Deploy Reports to GitHub Pages

```yaml
- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: ./allure-report
```

### Slack Notifications

```yaml
- name: Slack notification
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "Tests completed: ${{ job.status }}"
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Playwright CI Documentation](https://playwright.dev/docs/ci)
- [GitHub Actions Marketplace](https://github.com/marketplace?type=actions)
- [Workflow Syntax Reference](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)

## 📞 Support

- **GitHub Actions Issues:** https://github.com/actions/toolkit/issues
- **Playwright Issues:** https://github.com/microsoft/playwright/issues
- **Project Issues:** [Your repository issues page]

---

**Last Updated:** October 2024

