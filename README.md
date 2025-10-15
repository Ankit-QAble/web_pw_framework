# Playwright TypeScript Web Automation Framework

A comprehensive web automation framework built with Playwright and TypeScript, featuring page object model, robust locator management, Allure reporting, and cloud testing with Azure Playwright Testing (20-50 parallel workers).

## ⚡ What's New

- ✅ **Azure Pipelines CI/CD** - Complete pipeline configuration for automated testing
- ✅ **Azure Playwright Testing** - Fully configured and tested! Run with 20-50 parallel workers
- ✅ **GitHub Actions CI/CD** - 6 comprehensive workflows for automated testing
- ✅ **Test Data Management** - Complete guide for using JSON data files
- ✅ **Enhanced Documentation** - Step-by-step guides for all features

## 🚀 Features

- **Playwright Integration**: Latest Playwright with TypeScript support
- **Page Object Model**: Structured and maintainable page objects
- **Locator Management**: Centralized locator management system
- **Base Classes**: Reusable base classes for pages and tests
- **Test Data Management**: JSON-based test data with random data generation
- **Allure Reporting**: Beautiful test reports with screenshots and videos
- **Multi-Browser Support**: Chrome, Firefox, Safari, and mobile browsers
- **Cloud Testing**: Integrated support for BrowserStack, LambdaTest, and Azure Playwright Testing
- **Tag-Based Test Filtering**: Run tests by tags (@smoke, @critical, etc.)
- **Environment Configuration**: Support for multiple test environments
- **Screenshot Management**: Automatic screenshots on failure and custom captures
- **Logging System**: Comprehensive logging with different levels
- **CI/CD Integration**: Ready-to-use pipelines for GitHub Actions and Azure Pipelines
- **Code Quality**: ESLint and Prettier configuration

## 📁 Project Structure

```
web_pw_framework/
├── .github/
│   └── workflows/               # GitHub Actions workflows
│       ├── playwright-tests.yml         # Main CI pipeline
│       ├── lambdatest-tests.yml        # LambdaTest cloud tests
│       ├── browserstack-tests.yml      # BrowserStack cloud tests
│       ├── azure-playwright-tests.yml  # Azure cloud tests
│       ├── nightly-regression.yml      # Nightly regression
│       └── manual-test-run.yml         # Manual test execution
├── framework/
│   ├── core/
│   │   ├── BasePage.ts          # Base page class with common methods
│   │   ├── BaseTest.ts          # Base test class with fixtures
│   │   └── WebDriverWrapper.ts  # Browser management wrapper
│   └── utils/
│       ├── Logger.ts            # Logging utility
│       ├── TestData.ts          # Test data management
│       └── ScreenshotHelper.ts  # Screenshot utilities
├── test/
│   ├── specs/
│   │   └── login.spec.ts        # Sample test specifications
│   ├── pages/
│   │   └── LoginPage.ts         # Sample page object
│   ├── locators/
│   │   ├── BaseLocators.ts      # Base locator management
│   │   └── LoginPageLocators.ts # Sample page locators
│   └── data/
│       ├── users.json           # Test user data
│       └── environments.json    # Environment configurations
├── scripts/
│   ├── run-browserstack-tags.ps1 # BrowserStack tag runner (Windows)
│   ├── switch-env.js            # Environment switcher utility
│   └── generate-report.js       # Report generation utility
├── docs/
│   ├── BROWSERSTACK_SETUP.md    # BrowserStack setup guide
│   ├── MULTI_PROVIDER_SETUP.md  # Multi-provider setup guide
│   ├── AZURE_PLAYWRIGHT_SETUP.MD # Azure Playwright Testing guide
│   ├── AZURE_PIPELINES_SETUP.md # Azure Pipelines CI/CD guide
│   ├── GITHUB_ACTIONS_SETUP.md  # GitHub Actions CI/CD guide
│   └── EMAIL_REPORTING.md       # Email reporting guide
├── playwright.config.ts         # Playwright configuration (default)
├── playwright.service.config.ts # Azure Playwright Testing service config (20-50 workers)
├── playwright.azure.config.ts   # Azure Playwright Testing config (alternative)
├── azure-pipelines.yml         # Azure Pipelines CI/CD configuration
├── browserstack.yml            # BrowserStack configuration
├── env.azure.example           # Azure environment variables example
├── .env                        # Environment variables (not in git)
├── AZURE_QUICK_START.md        # Azure 5-minute quick start guide
├── AZURE_WORKING_GUIDE.md      # Azure working configuration guide
├── AZURE_PIPELINES_QUICK_START.md # Azure Pipelines quick reference
├── GITHUB_ACTIONS_QUICK_REFERENCE.md # GitHub Actions quick reference
├── GITHUB_ACTIONS_SUMMARY.md   # GitHub Actions setup summary
├── SWITCH_PROVIDER_GUIDE.md    # Cloud provider switching guide
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Install browsers
npm run install:browsers

# 3. Run tests locally
npm test

# 4. Run tests on Azure (20 workers) ⚡
npm run test:azure:smoke
```

### Quick Commands Cheat Sheet

| Command | Description | Where |
|---------|-------------|-------|
| `npm test` | Run all tests | Local |
| `npm run test:headed` | Run tests in headed mode | Local |
| `npm run test:ui` | Interactive UI mode | Local |
| `npm run test:azure:smoke` | Run smoke tests with 20 workers | Azure ⚡ |
| `npm run test:azure:50workers` | Maximum speed! | Azure ⚡⚡⚡ |
| `npm run test:lambdatest:smoke` | Smoke tests | LambdaTest |
| `npm run test:browserstack:smoke` | Smoke tests | BrowserStack |

## 🛠️ Setup

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd web_pw_framework
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install Playwright browsers**
   ```bash
   npm run install:browsers
   ```

4. **Set up environment variables**
   ```bash
   # Copy example file
   cp env.azure.example .env
   # Edit .env with your configuration
   ```

5. **Run your first test**
   ```bash
   # Local test
   npm test
   
   # Or Azure cloud test (if configured)
   npm run test:azure:smoke
   ```

## 🏃‍♂️ Running Tests

### Local Testing Commands (Your Machine)

```bash
# Run all tests locally
npm test

# Run tests in headed mode (see browser)
npm run test:headed

# Run tests with UI mode (interactive)
npm run test:ui

# Run tests in debug mode (step through tests)
npm run test:debug

# Run specific test file
npx playwright test test/specs/login.spec.ts

# Run tests with specific browser
npx playwright test --project=chromium

# Run with parallel workers (faster)
npx playwright test --workers=5

# Run specific tags
npx playwright test --grep "@smoke"
npx playwright test --grep "@critical"
npx playwright test --grep "@smoke|@critical"
```

### Cloud Testing Commands (Azure/LambdaTest/BrowserStack)

```bash
# Azure Playwright Testing (20-50 parallel workers) ⚡
npm run test:azure              # All tests with 20 workers
npm run test:azure:smoke        # Smoke tests with 20 workers
npm run test:azure:critical     # Critical tests with 20 workers
npm run test:azure:50workers    # Maximum speed with 50 workers!

# LambdaTest Cloud
npm run test:lambdatest         # All tests on LambdaTest
npm run test:lambdatest:smoke   # Smoke tests
npm run test:lambdatest:critical # Critical tests

# BrowserStack Cloud
npm run test:browserstack       # All tests on BrowserStack
npm run test:browserstack:smoke # Smoke tests
npm run test:browserstack:critical # Critical tests
```

### Complete Command Reference

#### Local Testing:
```powershell
npm test                              # All tests locally
npm run test:headed                   # Headed mode (see browser)
npm run test:ui                       # Interactive UI mode
npm run test:debug                    # Debug mode
npx playwright test --grep "@smoke"   # Tag-specific
npx playwright test --workers=5       # With parallel workers
```

#### Azure Testing (Fastest - 20-50 workers):
```powershell
npm run test:azure                    # All tests (20 workers)
npm run test:azure:smoke              # Smoke tests (20 workers)
npm run test:azure:critical           # Critical tests (20 workers)
npm run test:azure:tags               # Smoke + Critical (20 workers)
npm run test:azure:50workers          # Maximum speed! (50 workers)
npm run test:azure:chromium           # Chromium only (20 workers)
npm run test:azure:firefox            # Firefox only (20 workers)
npm run test:azure:webkit             # WebKit only (20 workers)
```

#### Other Cloud Providers:
```powershell
npm run test:lambdatest               # LambdaTest cloud
npm run test:lambdatest:smoke         # LambdaTest smoke tests
npm run test:browserstack             # BrowserStack cloud
npm run test:browserstack:smoke       # BrowserStack smoke tests
```

#### GitHub Actions (Automatic CI/CD):
```bash
# Runs automatically on:
# - Push to main/master/staging
# - Pull requests
# - Daily schedules
# - Manual triggers

# View at: https://github.com/YOUR_REPO/actions
```

### Environment-Specific Testing

The framework supports multiple environments (development, preprod, production) with separate configuration files:

```bash
# Run tests in development environment
npm run test:dev

# Run tests in pre-production environment
npm run test:preprod

# Run tests in production environment
npm run test:prod

# Switch environment using the utility script
npm run switch-env development
npm run switch-env preprod
npm run switch-env production
```

Each environment uses its own `.env.[environment]` file with specific configuration values.
```

### Cloud Testing (BrowserStack/LambdaTest/Azure)

The framework supports running tests on cloud platforms like BrowserStack, LambdaTest, and Azure Playwright Testing. Configuration is managed through `playwright.config.ts` profiles.

#### Running Tests on BrowserStack

```bash
# Run all tests on BrowserStack
npm run test:browserstack

# Run only @smoke tagged tests on BrowserStack
npm run test:browserstack:smoke

# Run only @critical tagged tests on BrowserStack
npm run test:browserstack:critical

# Run both @smoke and @critical tagged tests
npm run test:browserstack:tags
```

#### Running Tests on LambdaTest

```bash
# Run all tests on LambdaTest
npm run test:lambdatest

# Run only @smoke tagged tests
npm run test:lambdatest:smoke

# Run only @critical tagged tests
npm run test:lambdatest:critical

# Run both @smoke and @critical tagged tests
npm run test:lambdatest:tags
```

#### Direct Commands (BrowserStack)

```bash
# Single tag (use equals sign for Windows compatibility)
npx browserstack-node-sdk playwright test --grep="@smoke"
npx browserstack-node-sdk playwright test --grep="@critical"

# Multiple tags (see note below about Windows limitation)
npx browserstack-node-sdk playwright test --grep="@smoke|@critical"
```

**⚠️ Windows Note:** Due to a BrowserStack SDK limitation on Windows, the pipe operator `|` in grep patterns doesn't work properly with the SDK. The `test:browserstack:tags` script uses a PowerShell workaround (`scripts/run-browserstack-tags.ps1`) that runs each tag sequentially.

#### Direct Commands (LambdaTest)

```bash
# Single tag
npx playwright test --grep "@smoke"
npx playwright test --grep "@critical"

# Multiple tags (works on all platforms)
npx playwright test --grep "@smoke|@critical"

# PowerShell examples with specific test file
npx playwright test "test/specs/login.spec.ts" --grep "@smoke"
npx playwright test "test/specs/login.spec.ts" --grep "@critical"
npx playwright test "test/specs/login.spec.ts" --grep "@smoke|@critical"

# With specific project
npx playwright test --grep "@smoke" --project=chromium
npx playwright test --grep "@critical" --project="chrome:latest@Windows 11"
```

#### Running Tests on Azure Playwright Testing

Microsoft Azure Playwright Testing provides scalable cloud-hosted browsers for running your Playwright tests with faster execution and parallel testing capabilities.

**Prerequisites:**
- Active Azure subscription ([Create one here](https://portal.azure.com/))
- Azure CLI installed ([Installation Guide](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli))
- Azure Playwright Testing workspace created

**Step 1: Create Azure Playwright Testing Workspace**

1. Navigate to [Azure Portal](https://portal.azure.com/)
2. Search for **"Playwright Testing"** or **"Azure App Testing"**
3. Click **"Create"** → **"Playwright Testing"**
4. Fill in the details:
   - **Workspace Name**: `my-playwright-workspace`
   - **Region**: Choose closest region (e.g., `East US`, `West Europe`)
   - **Subscription**: Select your subscription
   - **Resource Group**: Create new or use existing
5. Click **"Review + Create"** → **"Create"**
6. Once created, go to your workspace and copy:
   - **Service URL**: `https://<region>.api.playwright.microsoft.com`
   - **Access Token** (from Settings → Access tokens)

**Step 2: Configure Environment Variables**

Create or update your `.env` file:

```bash
# Azure Playwright Testing Configuration
PLAYWRIGHT_SERVICE_URL=https://<your-region>.api.playwright.microsoft.com
PLAYWRIGHT_SERVICE_ACCESS_TOKEN=your-access-token-here

# Or use Entra ID authentication (recommended for production)
# PLAYWRIGHT_SERVICE_AUTH_TYPE=ENTRA_ID
```

**Step 3: Verify Azure Configuration**

The `playwright.azure.config.ts` file is already included in this framework. It's configured to:
- Use up to 20 parallel workers for fast execution
- Connect to Azure cloud-hosted browsers via the service URL
- Generate comprehensive test reports
- Capture screenshots and videos on failure

**Step 4: Authenticate with Azure**

**Option A: Using Access Token (Quick Start)**

```bash
# Set environment variables
export PLAYWRIGHT_SERVICE_URL=https://eastus.api.playwright.microsoft.com
export PLAYWRIGHT_SERVICE_ACCESS_TOKEN=your-access-token

# Run tests
npm run test:azure
```

**Option B: Using Entra ID (Recommended for Production)**

```bash
# Login to Azure
az login

# Set environment variables
export PLAYWRIGHT_SERVICE_URL=https://eastus.api.playwright.microsoft.com
export PLAYWRIGHT_SERVICE_AUTH_TYPE=ENTRA_ID

# Run tests
npm run test:azure
```

**Step 5: Run Tests on Azure**

```bash
# Run all tests on Azure
npm run test:azure

# Run smoke tests
npm run test:azure:smoke

# Run critical tests
npm run test:azure:critical

# Run specific browser
npm run test:azure:chromium

# Run with grep pattern
npx playwright test -c playwright.azure.config.ts --grep "@smoke"

# Run specific test file
npx playwright test -c playwright.azure.config.ts test/specs/login.spec.ts
```

**PowerShell Commands:**

```powershell
# Set environment variables
$env:PLAYWRIGHT_SERVICE_URL="https://eastus.api.playwright.microsoft.com"
$env:PLAYWRIGHT_SERVICE_ACCESS_TOKEN="your-access-token"

# Run tests
npm run test:azure

# Run with tags
npm run test:azure:smoke
npm run test:azure:critical

# Run specific project
npm run test:azure:chromium
```

**Azure Benefits:**

- ✅ **Scalable**: Run up to 50+ parallel workers
- ✅ **Fast**: Cloud-hosted browsers with optimized infrastructure
- ✅ **Global**: Multiple regions for faster execution
- ✅ **Secure**: Enterprise-grade security with Entra ID
- ✅ **Cost-effective**: Pay only for test minutes used
- ✅ **Integrated**: Works with Azure DevOps and GitHub Actions

**Viewing Test Results:**

1. Test results are available in your Azure Playwright Testing workspace
2. Navigate to [Azure Portal](https://portal.azure.com/)
3. Go to your Playwright Testing workspace
4. View test runs, reports, videos, and traces

**Troubleshooting Azure Playwright Testing:**

**Issue 1: Authentication Failed**
```bash
Error: Unable to authenticate with Azure Playwright Testing service
```
**Solution:**
- Verify your `PLAYWRIGHT_SERVICE_URL` is correct
- Check your access token hasn't expired
- Try re-authenticating: `az login`

**Issue 2: Service URL Not Set**
```bash
Error: PLAYWRIGHT_SERVICE_URL is not set
```
**Solution:**
```bash
export PLAYWRIGHT_SERVICE_URL=https://<your-region>.api.playwright.microsoft.com
```

**Issue 3: Package Not Installed**
```bash
Error: Cannot find module '@azure/microsoft-playwright-testing'
```
**Solution:**
```bash
npm install @azure/microsoft-playwright-testing --save-dev
```

**Azure Regions:**
- East US: `https://eastus.api.playwright.microsoft.com`
- West US: `https://westus.api.playwright.microsoft.com`
- West Europe: `https://westeurope.api.playwright.microsoft.com`
- UK South: `https://uksouth.api.playwright.microsoft.com`
- Australia East: `https://australiaeast.api.playwright.microsoft.com`

**✅ Azure is Fully Configured and Working!**

Your framework is tested and working with Azure Playwright Testing:
- ✅ 45 tests passed in 2 minutes with 20 workers
- ✅ Authentication configured
- ✅ All reports generating
- ✅ Ready to use!

**Quick Start:**
```powershell
npm run test:azure:smoke        # Run smoke tests (20 workers)
npm run test:azure:50workers    # Maximum speed (50 workers)
```

**Documentation:**
- 📚 **Complete Setup:** [`docs/AZURE_PLAYWRIGHT_SETUP.md`](docs/AZURE_PLAYWRIGHT_SETUP.md)
- ⚡ **Quick Start:** [`AZURE_QUICK_START.md`](AZURE_QUICK_START.md)
- ✅ **Working Guide:** [`AZURE_WORKING_GUIDE.md`](AZURE_WORKING_GUIDE.md) - Tested configuration!

**Additional Resources:**
- [Azure Playwright Testing Documentation](https://learn.microsoft.com/en-us/azure/playwright-testing/)
- [Quickstart Guide](https://learn.microsoft.com/en-us/azure/playwright-testing/quickstart-run-end-to-end-tests)
- [Configuration Options](https://learn.microsoft.com/en-us/azure/playwright-testing/how-to-use-service-config-file)
- [Pricing Information](https://azure.microsoft.com/en-us/pricing/details/playwright-testing/)

#### Complete Cloud Testing Examples

**BrowserStack with Tags:**
```powershell
# PowerShell - Run smoke tests on BrowserStack
npx browserstack-node-sdk playwright test --grep="@smoke"

# PowerShell - Run critical tests on BrowserStack
npx browserstack-node-sdk playwright test --grep="@critical"

# PowerShell - Run multiple tags (use the helper script)
npm run test:browserstack:tags
```

**LambdaTest with Tags:**
```powershell
# PowerShell - Run smoke tests on LambdaTest
npx playwright test --grep "@smoke"

# PowerShell - Run critical tests on LambdaTest
npx playwright test --grep "@critical"

# PowerShell - Run multiple tags on LambdaTest
npx playwright test --grep "@smoke|@critical"

# Bash/Git Bash - Run tests on LambdaTest
npx playwright test --grep "@smoke"
npx playwright test --grep "@critical"
npx playwright test --grep "@smoke|@critical"
```

#### Available NPM Scripts for Cloud Testing

| Script | Description |
|--------|-------------|
| **BrowserStack** | |
| `test:browserstack` | Run all tests on BrowserStack |
| `test:browserstack:smoke` | Run @smoke tests on BrowserStack |
| `test:browserstack:critical` | Run @critical tests on BrowserStack |
| `test:browserstack:tags` | Run @smoke and @critical tests (uses PowerShell script) |
| **LambdaTest** | |
| `test:lambdatest` | Run all tests on LambdaTest |
| `test:lambdatest:smoke` | Run @smoke tests on LambdaTest |
| `test:lambdatest:critical` | Run @critical tests on LambdaTest |
| `test:lambdatest:tags` | Run @smoke and @critical tests on LambdaTest |
| **Azure Playwright Testing** | |
| `test:azure` | Run all tests on Azure |
| `test:azure:smoke` | Run @smoke tests on Azure |
| `test:azure:critical` | Run @critical tests on Azure |
| `test:azure:tags` | Run @smoke and @critical tests on Azure |
| `test:azure:chromium` | Run tests on Azure with Chromium |
| `test:azure:firefox` | Run tests on Azure with Firefox |
| `test:azure:webkit` | Run tests on Azure with WebKit |

**Cloud Provider Comparison:**

| Provider | Workers | Speed | Setup | Status |
|----------|---------|-------|-------|--------|
| **Azure Playwright** | 20-50 | ⚡⚡⚡ Fastest | Easy | ✅ **Working!** |
| **LambdaTest** | 5-10 | ⚡⚡ Fast | Easy | ✅ Configured |
| **BrowserStack** | 5-15 | ⚡⚡ Fast | Medium | ✅ Configured |

**Recommendation:** Use **Azure** for fastest execution with 20-50 parallel workers!

For more details on cloud testing setup, see:
- ✅ **`AZURE_WORKING_GUIDE.md`** - Azure tested configuration (recommended!)
- `docs/AZURE_PLAYWRIGHT_SETUP.md` - Azure complete setup guide
- `AZURE_QUICK_START.md` - Azure 5-minute quick start
- `docs/BROWSERSTACK_SETUP.md` - BrowserStack configuration guide
- `docs/MULTI_PROVIDER_SETUP.md` - Multi-provider setup guide
- `SWITCH_PROVIDER_GUIDE.md` - Quick reference for switching providers

#### Troubleshooting Cloud Testing

**Issue: Tests not running with tags on BrowserStack**

**Solution:**
1. Ensure tags are in the test **title**, not just in metadata:
   ```typescript
   // ✅ Correct
   test('Login test @smoke', { tag: ['@smoke'] }, async () => { ... });
   
   // ❌ Incorrect
   test('Login test', { tag: ['@smoke'] }, async () => { ... });
   ```

2. Use the equals sign syntax for single tags:
   ```bash
   npx browserstack-node-sdk playwright test --grep="@smoke"
   ```

3. For multiple tags on Windows, use the npm script:
   ```bash
   npm run test:browserstack:tags
   ```

4. Verify tests are found locally first:
   ```bash
   npx playwright test --list --grep "@smoke"
   ```

#### Environment Configuration Files

The framework uses the following environment files:

- `.env.development` - Development environment settings
- `.env.preprod` - Pre-production environment settings
- `.env.production` - Production environment settings

#### Using Environment Variables in Tests

Access environment variables in your tests using the `EnvConfig` utility:

```typescript
import { envConfig } from '../../framework/utils/EnvConfig';

// Get base URL for current environment
const baseUrl = envConfig.getBaseUrl();

// Get any environment variable with optional default value
const timeout = envConfig.get('ACTION_TIMEOUT', '30000');

// Get current environment name
const environment = envConfig.getEnvironment();
```

#### Creating Custom Environment Files

To add a new environment:

1. Create a new file named `.env.[your-environment]`
2. Add your environment-specific variables
3. Update the `switch-env.js` script to include your new environment
```

### Running with staging via PROJECT (PowerShell)

```powershell
$env:PROJECT="sadad-en-chromium-staging"
npx playwright test "test/specs/login.spec.ts" --project=chromium
```

### Full run command examples (PowerShell)

- Desktop Chromium
```powershell
$env:PROJECT="sadad-en-chromium-staging"
npx playwright test "test/specs/login.spec.ts" --project=chromium
```

- Desktop Firefox
```powershell
$env:PROJECT="sadad-en-firefox-staging"
npx playwright test "test/specs/login.spec.ts" --project=firefox
```

- Desktop WebKit (Safari engine)
```powershell
$env:PROJECT="sadad-en-webkit-staging"
npx playwright test "test/specs/login.spec.ts" --project=webkit
```

- Mobile Chrome (Pixel 5)
```powershell
$env:PROJECT="sadad-en-chromium-mobile-staging"
npx playwright test "test/specs/login.spec.ts" --project="Mobile Chrome"
```

- Mobile Safari (iPhone 12)
```powershell
$env:PROJECT="sadad-en-webkit-mobile-staging"
npx playwright test "test/specs/login.spec.ts" --project="Mobile Safari"
```

- Microsoft Edge
```powershell
$env:PROJECT="sadad-en-chromium-staging"
npx playwright test "test/specs/login.spec.ts" --project="Microsoft Edge"
```

- Google Chrome
```powershell
$env:PROJECT="sadad-en-chromium-staging"
npx playwright test "test/specs/login.spec.ts" --project="Google Chrome"
```

Notes:
- Replace `staging` with `production`, `qa`, or `dev` as needed.
- cmd.exe example: `set PROJECT=sadad-en-chromium-staging && npx playwright test "test/specs/login.spec.ts" --project=chromium`
- Git Bash example: `PROJECT=sadad-en-chromium-staging npx playwright test "test/specs/login.spec.ts" --project=chromium`

### Single-line run + Allure report

- PowerShell (Chromium, staging)
```powershell
$env:PROJECT="sadad-en-chromium-staging"; npx playwright test "test/specs/login.spec.ts" --project=chromium; npx allure generate allure-results --clean; npx allure open
```

- PowerShell (Firefox)
```powershell
$env:PROJECT="sadad-en-firefox-staging"; npx playwright test "test/specs/login.spec.ts" --project=firefox; npx allure generate allure-results --clean; npx allure open
```

- PowerShell (WebKit)
```powershell
$env:PROJECT="sadad-en-webkit-staging"; npx playwright test "test/specs/login.spec.ts" --project=webkit; npx allure generate allure-results --clean; npx allure open
```

- PowerShell (Mobile Chrome)
```powershell
$env:PROJECT="sadad-en-chromium-mobile-staging"; npx playwright test "test/specs/login.spec.ts" --project="Mobile Chrome"; npx allure generate allure-results --clean; npx allure open
```

- PowerShell (Mobile Safari)
```powershell
$env:PROJECT="sadad-en-webkit-mobile-staging"; npx playwright test "test/specs/login.spec.ts" --project="Mobile Safari"; npx allure generate allure-results --clean; npx allure open
```

- PowerShell (Edge)
```powershell
$env:PROJECT="sadad-en-chromium-staging"; npx playwright test "test/specs/login.spec.ts" --project="Microsoft Edge"; npx allure generate allure-results --clean; npx allure open
```

- PowerShell (Chrome)
```powershell
$env:PROJECT="sadad-en-chromium-staging"; npx playwright test "test/specs/login.spec.ts" --project="Google Chrome"; npx allure generate allure-results --clean; npx allure open
```

- cmd.exe (Chromium, staging)
```cmd
set PROJECT=sadad-en-chromium-staging && npx playwright test "test/specs/login.spec.ts" --project=chromium && npx allure generate allure-results --clean && npx allure open
```

- Git Bash (Chromium, staging)
```bash
PROJECT="sadad-en-chromium-staging" npx playwright test "test/specs/login.spec.ts" --project=chromium && npx allure generate allure-results --clean && npx allure open
```

## Tagging tests and running by tag

Add tags directly in the title of tests or suites. **Important:** For BrowserStack/LambdaTest compatibility, tags MUST be included in the test title, not just in the tag metadata.

```typescript
// ✅ Correct: Tag in test title (works everywhere)
test('Enter valid credentials @smoke', { tag: ['@smoke'] }, async ({ logger }) => {
  // ...
});

// ✅ Tag the whole suite
test.describe('Login Page Tests @smoke', () => {
  // tests...
});

// ❌ Incorrect: Tag only in metadata (doesn't work with --grep)
test('Enter valid credentials', { tag: ['@smoke'] }, async ({ logger }) => {
  // This won't be found by --grep "@smoke"
});
```

### Run tests by tag locally:

- PowerShell
```powershell
$env:PROJECT="sadad-en-chromium-staging"; npx playwright test "test/specs/login.spec.ts" --project=chromium --grep "@smoke"
```

- Multiple tags (run any):
```powershell
$env:PROJECT="sadad-en-chromium-staging"; npx playwright test --grep "@smoke|@auth"
```

- Exclude a tag:
```powershell
$env:PROJECT="sadad-en-chromium-staging"; npx playwright test --grep "@auth" --grep-invert "@slow"
```

### Run tests by tag on cloud platforms:

See the [Cloud Testing](#cloud-testing-browserstacklambdatest) section above for BrowserStack and LambdaTest commands.

## 📊 Reporting

### Allure Reports

```bash
# Generate and serve Allure report
npm run report

# Generate Allure report only
npm run report:generate
```

### Built-in Reports

- HTML Report: `playwright-report/index.html`
- Screenshots: `screenshots/`
- Videos: `test-results/`
- Traces: `test-results/`

### Email Reporting

The framework includes email reporting functionality that automatically sends test results and reports via email.

**Supported Email Providers:**
- **Gmail**: Requires app-specific password
- **Outlook/Office 365**: Supports regular password or app password
- **Custom SMTP**: Any SMTP-compatible server

**Configuration:**
```bash
# Set email provider
export EMAIL_PROVIDER=outlook  # or gmail

# Configure SMTP settings
export SMTP_USER=your-email@outlook.com
export SMTP_PASS=your-password
```

For detailed email configuration, see [Email Reporting Documentation](docs/EMAIL_REPORTING.md).

## 📝 Writing Tests

### Basic Test Structure

```typescript
import { test, expect } from '../../framework/core/BaseTest';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page, logger }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigateToLogin();
  });

  test('should login successfully', async ({ logger }) => {
    await logger.step('Enter credentials', async () => {
      await loginPage.login({
        username: 'test@example.com',
        password: 'password123'
      });
    });

    await logger.step('Verify login success', async () => {
      expect(await loginPage.isLoginSuccessful()).toBeTruthy();
    });
  });
});
```

### Creating Page Objects

```typescript
import { Page } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';
import { MyPageLocators } from '../locators/MyPageLocators';

export class MyPage extends BasePage {
  private locators: MyPageLocators;

  constructor(page: Page, url?: string) {
    super(page, url);
    this.locators = new MyPageLocators(page);
  }

  async performAction(): Promise<void> {
    const element = this.locators.getLocator('myElement');
    await this.click(element);
  }
}
```

### Creating Locators

```typescript
import { Page } from '@playwright/test';
import { BaseLocators } from './BaseLocators';

export class MyPageLocators extends BaseLocators {
  constructor(page: Page) {
    super(page);
  }

  protected initializeLocators(): void {
    this.addLocator('myElement', {
      selector: '[data-testid="my-element"]',
      description: 'My important element',
      timeout: 10000
    });
  }
}
```

## 🔧 Configuration

### Playwright Configuration

Edit `playwright.config.ts` to customize:
- Test directory
- Browser projects
- Timeouts
- Reporters
- Base URL

### Environment Configuration

Edit `test/data/environments.json` to add new environments:

```json
{
  "myEnvironment": {
    "baseUrl": "https://my-env.example.com",
    "apiUrl": "https://api-my-env.example.com",
    "features": {
      "twoFactorAuth": true
    }
  }
}
```

### Test Data Management

The framework supports loading test data from JSON files located in `test/data/`.

#### Using the users.json Data File

**Structure of users.json:**
```json
{
  "validUsers": [
    {
      "username": "90336607",
      "password": "QAble@2020",
      "otp": "333333",
      "firstName": "Admin",
      "lastName": "User",
      "address": {
        "street": "123 Admin Street",
        "city": "New York",
        "country": "USA"
      }
    }
  ],
  "invalidUsers": [
    {
      "username": "invalid@example.com",
      "password": "wrongpassword",
      "expectedError": "Invalid username or password"
    }
  ]
}
```

#### How to Use Test Data in Your Tests

**Method 1: Direct JSON Import (Recommended)**

```typescript
import { test } from '../../framework/core/BaseTest';
import { LoginPage } from '../pages/LoginPage';
import userData from '../data/users.json';

test.describe('Login Tests', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('should login with valid user @smoke', async ({ logger }) => {
    // Access valid user data
    const validUser = userData.validUsers[0];
    
    await logger.step('Login with valid credentials', async () => {
      await loginPage.login(validUser.username, validUser.password);
    });
    
    await logger.step('Verify login successful', async () => {
      // Your assertions here
    });
  });

  test('should show error for invalid user @negative', async ({ logger }) => {
    // Access invalid user data
    const invalidUser = userData.invalidUsers[0];
    
    await logger.step('Attempt login with invalid credentials', async () => {
      await loginPage.login(invalidUser.username, invalidUser.password);
    });
    
    await logger.step('Verify error message', async () => {
      // Verify expectedError message is displayed
    });
  });

  test('should use user profile data @smoke', async ({ logger }) => {
    const user = userData.validUsers[0];
    
    // Access nested data
    console.log(`User: ${user.firstName} ${user.lastName}`);
    console.log(`Address: ${user.address.street}, ${user.address.city}`);
    console.log(`OTP: ${user.otp}`);
  });
});
```

**Method 2: Using Node.js fs Module**

```typescript
import { test } from '../../framework/core/BaseTest';
import { LoginPage } from '../pages/LoginPage';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Login Tests with Dynamic Data', () => {
  let loginPage: LoginPage;
  let testData: any;

  test.beforeAll(() => {
    // Load data dynamically
    const dataPath = path.join(__dirname, '../data/users.json');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    testData = JSON.parse(rawData);
  });

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.navigate();
  });

  test('should login with valid user', async () => {
    const user = testData.validUsers[0];
    await loginPage.login(user.username, user.password);
  });
});
```

**Method 3: Data-Driven Testing (Multiple Users)**

```typescript
import { test } from '../../framework/core/BaseTest';
import { LoginPage } from '../pages/LoginPage';
import userData from '../data/users.json';

test.describe('Data-Driven Login Tests', () => {
  // Test with all valid users
  userData.validUsers.forEach((user, index) => {
    test(`should login successfully - User ${index + 1} @smoke`, async ({ page, logger }) => {
      const loginPage = new LoginPage(page);
      await loginPage.navigate();
      
      await logger.step(`Login with user: ${user.username}`, async () => {
        await loginPage.login(user.username, user.password);
      });
      
      await logger.step('Verify login successful', async () => {
        // Your assertions
      });
    });
  });

  // Test with all invalid users
  userData.invalidUsers.forEach((user, index) => {
    test(`should fail login - Invalid User ${index + 1} @negative`, async ({ page, logger }) => {
      const loginPage = new LoginPage(page);
      await loginPage.navigate();
      
      await logger.step('Attempt invalid login', async () => {
        await loginPage.login(user.username, user.password);
      });
      
      await logger.step('Verify error message', async () => {
        // Verify user.expectedError is displayed
      });
    });
  });
});
```

**Method 4: Creating Helper Functions**

```typescript
// test/utils/DataHelper.ts
import userData from '../data/users.json';

export class DataHelper {
  static getValidUser(index: number = 0) {
    return userData.validUsers[index];
  }

  static getInvalidUser(index: number = 0) {
    return userData.invalidUsers[index];
  }

  static getAllValidUsers() {
    return userData.validUsers;
  }

  static getRandomValidUser() {
    const users = userData.validUsers;
    return users[Math.floor(Math.random() * users.length)];
  }
}

// Usage in test
import { test } from '../../framework/core/BaseTest';
import { LoginPage } from '../pages/LoginPage';
import { DataHelper } from '../utils/DataHelper';

test('should login with helper @smoke', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const user = DataHelper.getValidUser(0);
  
  await loginPage.navigate();
  await loginPage.login(user.username, user.password);
});
```

#### Adding More Test Data

To add more users, simply update `test/data/users.json`:

```json
{
  "validUsers": [
    {
      "username": "90336607",
      "password": "QAble@2020",
      "otp": "333333",
      "firstName": "Admin",
      "lastName": "User"
    },
    {
      "username": "90336608",
      "password": "QAble@2021",
      "otp": "444444",
      "firstName": "Test",
      "lastName": "User2"
    }
  ],
  "invalidUsers": [
    {
      "username": "invalid@example.com",
      "password": "wrongpassword",
      "expectedError": "Invalid username or password"
    }
  ]
}
```

#### Creating Additional Data Files

You can create separate data files for different test scenarios:

- `test/data/users.json` - User credentials
- `test/data/products.json` - Product test data
- `test/data/config.json` - Configuration data
- `test/data/environments.json` - Environment-specific settings

Example: `test/data/products.json`
```json
{
  "products": [
    {
      "id": "PROD001",
      "name": "Test Product",
      "price": 99.99,
      "category": "Electronics"
    }
  ]
}
```

Usage:
```typescript
import productData from '../data/products.json';

test('should add product to cart', async ({ page }) => {
  const product = productData.products[0];
  // Use product.id, product.name, etc.
});
```

## 🎯 Best Practices

### Page Objects
- Keep page objects focused on a single page or component
- Use descriptive method names
- Return meaningful data from methods
- Handle waits and assertions appropriately

### Locators
- Prefer data-testid attributes
- Use semantic locators when possible
- Provide fallback selectors
- Add meaningful descriptions

### Tests
- Use the step pattern for better reporting
- Keep tests independent and atomic
- Use meaningful test and describe names
- Clean up test data when necessary

### Error Handling
- Use try-catch blocks for expected failures
- Provide meaningful error messages
- Take screenshots on failures
- Log important actions and verifications

## 🐛 Debugging

### Debug Mode
```bash
# Run in debug mode
npm run test:debug

# Debug specific test
npx playwright test login.spec.ts --debug
```

### Screenshots and Videos
- Screenshots are automatically taken on failure
- Videos are recorded for failed tests
- Use `takeScreenshot()` method for custom captures

### Logging
```typescript
// Different log levels
logger.debug('Debug information');
logger.info('General information');
logger.warn('Warning message');
logger.error('Error message');

// Step logging for reports
await logger.step('Step description', async () => {
  // Your test actions
});
```

## 🔧 Jenkins Diagnostic Tools

The framework includes specialized diagnostic tools for Jenkins CI environments to help troubleshoot common issues.

### Environment Diagnostic

Check Jenkins environment setup, system resources, and dependencies:

```bash
# Run environment diagnostic
npm run diagnose:jenkins
```

This script checks:
- Environment variables (CI, JENKINS, BUILD_NUMBER, etc.)
- System resources (memory, disk space)
- Node.js and npm versions
- Playwright installation and browser availability
- Project structure and required files
- Playwright cache directories and permissions

### Browser Diagnostic

Test browser behavior and page stability in Jenkins environment:

```bash
# Run browser diagnostic
npm run diagnose:browser
```

This script performs:
- Browser launch with Jenkins-optimized settings
- Navigation testing with extended timeouts
- Network idle validation
- Page stability checks (50-second extended wait)
- Element presence verification
- Screenshot capability testing

### Jenkins Troubleshooting

For detailed Jenkins troubleshooting guidance, see:
- `docs/JENKINS_TROUBLESHOOTING.md` - Comprehensive Jenkins setup and troubleshooting guide

### Common Jenkins Issues

1. **Browser Launch Failures**
   - Use Jenkins-optimized browser arguments
   - Check system resources and permissions
   - Verify Playwright browser installation

2. **Page Closure Issues**
   - Extended timeouts for CI environments
   - Network idle handling
   - Resource cleanup

3. **Environment Configuration**
   - CI environment variables
   - Cache directory permissions
   - Node.js version compatibility

## 🔄 CI/CD Integration

This framework supports multiple CI/CD platforms with pre-configured pipelines for automated testing.

### GitHub Actions

This framework includes comprehensive GitHub Actions workflows for automated testing. See [`docs/GITHUB_ACTIONS_SETUP.md`](docs/GITHUB_ACTIONS_SETUP.md) for complete setup guide.

### Azure Pipelines

Azure Pipelines is fully configured and ready to use. The pipeline supports multi-stage testing, parallel execution, and comprehensive reporting.

**Quick Setup:**

1. **Create Pipeline in Azure DevOps:**
   - Go to **Pipelines** → **New Pipeline**
   - Select your repository
   - Choose **Existing Azure Pipelines YAML file**
   - Select `/azure-pipelines.yml`
   - Click **Run**

2. **Configure Pipeline Variables:**
   ```
   NODE_VERSION = 20.x
   CI = true
   PLAYWRIGHT_SERVICE_URL = your-azure-service-url (optional)
   PLAYWRIGHT_SERVICE_ACCESS_TOKEN = your-token (optional)
   ```

3. **Pipeline Features:**
   - ✅ Multi-stage testing (Smoke, Critical, Full Suite)
   - ✅ Parallel execution across multiple browsers
   - ✅ Automated Allure report generation
   - ✅ Test results and artifacts publishing
   - ✅ Azure Playwright Testing integration
   - ✅ Scheduled runs and manual triggers

**Pipeline Stages:**
- **Setup**: Install dependencies and browsers
- **Smoke Tests**: Run @smoke tagged tests on all browsers
- **Critical Tests**: Run @critical tagged tests
- **Full Tests**: Complete test suite execution
- **Generate Reports**: Create Allure reports
- **Azure Cloud Tests**: Optional cloud browser testing

**Documentation:**
- 📚 **Complete Guide:** [`docs/AZURE_PIPELINES_SETUP.md`](docs/AZURE_PIPELINES_SETUP.md)
- ⚡ **Quick Start:** [`AZURE_PIPELINES_QUICK_START.md`](AZURE_PIPELINES_QUICK_START.md)

### GitHub Actions - Available Workflows

| Workflow | Purpose | Trigger |
|----------|---------|---------|
| **Playwright Tests CI** | Main CI pipeline | Push, PR, Manual |
| **LambdaTest Tests** | Cloud testing on LambdaTest | Push, PR, Daily, Manual |
| **BrowserStack Tests** | Cloud testing on BrowserStack | Push, PR, Daily, Manual |
| **Azure Playwright** | Cloud testing on Azure | Push, PR, Daily, Manual |
| **Nightly Regression** | Full regression suite | Daily, Manual |
| **Manual Execution** | On-demand test runs | Manual |

### Quick Setup

1. **Set Repository Secrets** (Settings → Secrets → Actions):
   ```
   LT_USERNAME, LT_ACCESS_KEY                    # For LambdaTest
   BROWSERSTACK_USERNAME, BROWSERSTACK_ACCESS_KEY # For BrowserStack
   PLAYWRIGHT_SERVICE_URL, PLAYWRIGHT_SERVICE_ACCESS_TOKEN # For Azure
   ```

2. **Push workflows to GitHub:**
   ```bash
   git add .github/workflows/
   git commit -m "Add GitHub Actions workflows"
   git push origin main
   ```

3. **Run your first workflow:**
   - Go to **Actions** tab
   - Select **Manual Test Execution**
   - Click **Run workflow**

### Manual Workflow Execution

```bash
# Via GitHub CLI
gh workflow run "Manual Test Execution" \
  --field cloud_provider=lambdatest \
  --field test_tags="@smoke" \
  --field browser=chromium \
  --field environment=staging

# Run Azure tests
gh workflow run "Azure Playwright Testing" \
  --field test_tags="@smoke|@critical" \
  --field workers=20
```

### Viewing Results

- **GitHub UI:** Repository → Actions → Select Run
- **Download Reports:** `gh run download <run-id>`
- **Cloud Dashboards:**
  - LambdaTest: https://automation.lambdatest.com/
  - BrowserStack: https://automate.browserstack.com/
  - Azure: https://portal.azure.com/

### Documentation

- 📚 **Complete Guide:** [`docs/GITHUB_ACTIONS_SETUP.md`](docs/GITHUB_ACTIONS_SETUP.md)
- ⚡ **Quick Reference:** [`GITHUB_ACTIONS_QUICK_REFERENCE.md`](GITHUB_ACTIONS_QUICK_REFERENCE.md)

### GitHub Actions Example (Legacy)

```yaml
name: Playwright Tests
on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - uses: actions/setup-node@v3
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm ci
    - name: Install Playwright browsers
      run: npx playwright install --with-deps
    - name: Run Playwright tests
      run: npm test
    - uses: actions/upload-artifact@v3
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 30
```

## 📚 Additional Resources

- [Playwright Documentation](https://playwright.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Allure Framework](https://docs.qameta.io/allure/)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run linting and tests
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.