# Playwright TypeScript Web Automation Framework

A comprehensive web automation framework built with Playwright and TypeScript, featuring page object model, robust locator management, and Allure reporting.

## 🚀 Features

- **Playwright Integration**: Latest Playwright with TypeScript support
- **Page Object Model**: Structured and maintainable page objects
- **Locator Management**: Centralized locator management system
- **Base Classes**: Reusable base classes for pages and tests
- **Test Data Management**: JSON-based test data with random data generation
- **Allure Reporting**: Beautiful test reports with screenshots and videos
- **Multi-Browser Support**: Chrome, Firefox, Safari, and mobile browsers
- **Environment Configuration**: Support for multiple test environments
- **Screenshot Management**: Automatic screenshots on failure and custom captures
- **Logging System**: Comprehensive logging with different levels
- **Code Quality**: ESLint and Prettier configuration

## 📁 Project Structure

```
web_pw_framework/
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
├── playwright.config.ts         # Playwright configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
└── README.md                   # This file
```

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
   cp .env.example .env
   # Edit .env with your configuration
   ```

## 🏃‍♂️ Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in headed mode
npm run test:headed

# Run tests with UI mode
npm run test:ui

# Run tests in debug mode
npm run test:debug

# Run specific test file
npx playwright test login.spec.ts

# Run tests with specific browser
npx playwright test --project=chromium
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

Add tags directly in the title of tests or suites:

```typescript
// Single test tagged as @smoke
test('Enter valid credentials @smoke', async ({ logger }) => {
  // ...
});

// Tag the whole suite
test.describe('Login Page Tests @smoke', () => {
  // tests...
});
```

Run tests by tag:

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

```typescript
// Load test data from JSON
const userData = await testData.loadFromFile('./test/data/users.json');

// Generate random data
const randomUser = testData.generateRandomUser();

// Environment-specific data
const envData = testData.getEnvironmentData('staging');
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

## 🔄 CI/CD Integration

### GitHub Actions Example

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