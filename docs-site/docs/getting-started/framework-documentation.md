---
sidebar_position: 2
---

# Framework Documentation

This comprehensive guide covers the entire framework architecture, including core classes, utilities, and their practical usage with detailed examples.

## Overview

The framework is built on a solid foundation of reusable components that provide:

- **BasePage** - Abstract base class for all page objects
- **BaseTest** - Abstract base class for test fixtures and utilities
- **Logger** - Comprehensive logging system with multiple levels
- **ScreenshotHelper** - Advanced screenshot management and visual testing
- **EmailService** - Automated email reporting with attachments
- **DataHelper** - Simple and efficient JSON data loading and management
- **EnvConfig** - Environment configuration management
- **Global Setup/Teardown** - Test lifecycle management

## Core Classes

### BasePage Class

The `BasePage` class is the foundation for all page objects in the framework. It provides common functionality, element highlighting, and robust error handling.

#### Key Features

- **Element Highlighting** - Visual debugging with yellow background and red border
- **Robust Wait Strategies** - Multiple wait conditions for different scenarios
- **Screenshot Integration** - Automatic screenshots on failures
- **Comprehensive Logging** - Detailed logging for all actions
- **Error Handling** - Graceful error handling with descriptive messages

#### Basic Usage

```typescript
import { Page, TestInfo } from '@playwright/test';
import { BasePage } from '../framework/core/BasePage';

export class LoginPage extends BasePage {
  // Locators
  private readonly usernameField = '#username';
  private readonly passwordField = '#password';
  private readonly loginButton = '#login-btn';
  private readonly errorMessage = '.error-message';

  constructor(page: Page, testInfo?: TestInfo) {
    super(page, 'https://example.com/login', testInfo);
  }

  // Page-specific methods
  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameField, username);
    await this.fill(this.passwordField, password);
    await this.click(this.loginButton);
    await this.waitForNavigation();
  }

  async verifyErrorMessage(expectedMessage: string): Promise<void> {
    await this.waitForVisible(this.errorMessage);
    await this.verifyText(this.errorMessage, expectedMessage);
  }
}
```

#### Advanced Usage Examples

```typescript
export class DashboardPage extends BasePage {
  constructor(page: Page, testInfo?: TestInfo) {
    super(page, 'https://example.com/dashboard', testInfo);
  }

  // Custom navigation with retry logic
  async navigateWithRetry(maxRetries: number = 3): Promise<void> {
    for (let i = 0; i < maxRetries; i++) {
      try {
        await this.navigate();
        await this.waitForPageLoad();
        return;
      } catch (error) {
        this.logger.warn(`Navigation attempt ${i + 1} failed`, error as Error);
        if (i === maxRetries - 1) throw error;
        await this.waitForTimeout(2000);
      }
    }
  }

  // Element interaction with validation
  async clickWithValidation(selector: string): Promise<void> {
    const locator = this.getLocator(selector);
    await this.waitUntilElementClickable(locator);
    await this.validateElementState(locator);
    await this.click(selector);
  }

  // Custom screenshot for specific actions
  async takeActionScreenshot(actionName: string): Promise<string> {
    return await this.takeScreenshot(`action-${actionName}-${Date.now()}`);
  }
}
```

#### Available Methods

| Method | Description | Example |
|--------|-------------|---------|
| `click(selector)` | Click an element | `await this.click('#submit-btn')` |
| `fill(selector, value)` | Fill form field | `await this.fill('#email', 'user@example.com')` |
| `getText(selector)` | Get element text | `const text = await this.getText('.status')` |
| `isVisible(selector)` | Check visibility | `const visible = await this.isVisible('.modal')` |
| `waitForVisible(selector)` | Wait for element | `await this.waitForVisible('#loading')` |
| `waitUntilElementPresent(selector)` | Wait for DOM presence | `await this.waitUntilElementPresent('#dynamic-content')` |
| `waitUntilElementClickable(selector)` | Wait for clickable state | `await this.waitUntilElementClickable('#button')` |
| `expectVisible(selector)` | Assert visibility | `await this.expectVisible('#success-message')` |
| `selectOption(selector, value)` | Select dropdown option | `await this.selectOption('#country', 'US')` |
| `verifyText(selector, expected)` | Verify text content | `await this.verifyText('.title', 'Welcome')` |
| `takeScreenshot(name)` | Take screenshot | `await this.takeScreenshot('login-success')` |

### BaseTest Class

The `BaseTest` class provides test-level utilities and fixtures for comprehensive test management.

#### Key Features

- **Test Fixtures** - Pre-configured logger and screenshot helper
- **Keyboard Operations** - Complete keyboard interaction support
- **Browser Management** - Viewport, navigation, and data management
- **Dialog Handling** - Alert, confirm, and prompt handling
- **JavaScript Execution** - Custom script execution in browser context

#### Basic Usage

```typescript
import { test, expect } from '@playwright/test';
import { BaseTest } from '../framework/core/BaseTest';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login Tests', () => {
  test('should login successfully', async ({ page, context, logger, screenshotHelper }) => {
    const baseTest = new BaseTest(page, context, logger);
    const loginPage = new LoginPage(page, test.info());

    await baseTest.setup();
    
    try {
      await loginPage.navigate();
      await loginPage.login('testuser', 'password123');
      
      // Verify successful login
      await expect(page).toHaveURL(/dashboard/);
      logger.info('Login test completed successfully');
    } finally {
      await baseTest.teardown();
    }
  });
});
```

#### Advanced Usage Examples

```typescript
test.describe('Advanced Test Scenarios', () => {
  test('keyboard navigation test', async ({ page, context, logger }) => {
    const baseTest = new BaseTest(page, context, logger);
    
    await baseTest.navigateTo('https://example.com/form');
    
    // Tab navigation
    await baseTest.pressTab();
    await baseTest.typeText('John Doe');
    
    // Keyboard shortcuts
    await baseTest.pressCtrlA(); // Select all
    await baseTest.pressCtrlC(); // Copy
    await baseTest.pressTab();
    await baseTest.pressCtrlV(); // Paste
    
    // Arrow key navigation
    await baseTest.pressArrowLeft();
    await baseTest.pressArrowRight();
    
    // Function keys
    await baseTest.pressF5(); // Refresh
  });

  test('dialog handling test', async ({ page, context, logger }) => {
    const baseTest = new BaseTest(page, context, logger);
    
    // Handle alert dialog
    await baseTest.handleDialog(true); // Accept
    await page.click('#trigger-alert');
    
    // Handle confirm dialog
    await baseTest.handleDialog(false); // Dismiss
    await page.click('#trigger-confirm');
    
    // Handle prompt dialog
    await baseTest.handleDialog(true, 'Custom input');
    await page.click('#trigger-prompt');
  });

  test('viewport and responsive test', async ({ page, context, logger }) => {
    const baseTest = new BaseTest(page, context, logger);
    
    // Test different viewport sizes
    await baseTest.setViewportSize(1920, 1080); // Desktop
    await baseTest.navigateTo('https://example.com');
    
    await baseTest.setViewportSize(768, 1024); // Tablet
    await baseTest.reloadPage();
    
    await baseTest.setViewportSize(375, 667); // Mobile
    await baseTest.reloadPage();
  });
});
```

#### Available Methods

| Category | Method | Description |
|----------|--------|-------------|
| **Navigation** | `navigateTo(url)` | Navigate to URL |
| | `reloadPage()` | Reload current page |
| | `goBack()` | Go back in history |
| | `goForward()` | Go forward in history |
| **Browser Management** | `setViewportSize(width, height)` | Set viewport size |
| | `clearBrowserData()` | Clear cookies and permissions |
| | `takeScreenshot(name)` | Take screenshot |
| **Keyboard** | `pressEnter()` | Press Enter key |
| | `pressTab()` | Press Tab key |
| | `pressEscape()` | Press Escape key |
| | `pressCtrlA()` | Press Ctrl+A |
| | `pressCtrlC()` | Press Ctrl+C |
| | `pressCtrlV()` | Press Ctrl+V |
| | `typeText(text)` | Type text |
| | `typeTextSlowly(text)` | Type with delay |
| **Dialog** | `handleDialog(accept, promptText)` | Handle dialogs |
| **JavaScript** | `executeScript(script)` | Execute JavaScript |

## Utility Classes

### Logger Class

The `Logger` class provides comprehensive logging capabilities with multiple levels and structured output.

#### Key Features

- **Multiple Log Levels** - DEBUG, INFO, WARN, ERROR
- **Structured Logging** - Timestamp, level, class name, message
- **Test Step Tracking** - Step-by-step test execution logging
- **API Logging** - Request/response logging
- **Child Loggers** - Context-specific logging

#### Basic Usage

```typescript
import { Logger, LogLevel } from '../framework/utils/Logger';

const logger = new Logger('MyTestClass');

// Basic logging
logger.info('Test started');
logger.debug('Debug information');
logger.warn('Warning message');
logger.error('Error occurred', new Error('Something went wrong'));

// Test step logging
await logger.step('Login to application', async () => {
  await loginPage.login('user', 'pass');
});

// API logging
logger.apiRequest('POST', '/api/login', { username: 'user' });
logger.apiResponse(200, 150, { token: 'abc123' });
```

#### Advanced Usage

```typescript
// Create child logger for specific context
const apiLogger = logger.child('API');
apiLogger.info('Making API call');

// Set log level dynamically
logger.setLogLevel(LogLevel.DEBUG);

// Test lifecycle logging
logger.testStart('User Registration Test');
logger.assertion('Email field is visible', true, true);
logger.testEnd('User Registration Test', true);
```

#### Log Levels

| Level | Description | Usage |
|-------|-------------|-------|
| `DEBUG` | Detailed debugging information | Development and troubleshooting |
| `INFO` | General information | Normal test execution |
| `WARN` | Warning messages | Non-critical issues |
| `ERROR` | Error messages | Test failures and exceptions |

### ScreenshotHelper Class

The `ScreenshotHelper` class provides advanced screenshot capabilities for visual testing and debugging.

#### Key Features

- **Automatic Naming** - Timestamp and test-based naming
- **Multiple Types** - Full page, element, masked, comparison screenshots
- **Test Integration** - Automatic attachment to test reports
- **Directory Management** - Organized screenshot storage
- **Cleanup Utilities** - Automatic cleanup of old screenshots

#### Basic Usage

```typescript
import { ScreenshotHelper } from '../framework/utils/ScreenshotHelper';

test('screenshot example', async ({ page, testInfo }) => {
  const screenshotHelper = new ScreenshotHelper(page, testInfo);
  
  // Basic screenshot
  await screenshotHelper.takeScreenshot('homepage');
  
  // Element screenshot
  await screenshotHelper.takeElementScreenshot('.hero-section', 'hero');
  
  // Screenshot with custom options
  await screenshotHelper.takeScreenshot('custom', {
    fullPage: false,
    clip: { x: 0, y: 0, width: 800, height: 600 },
    quality: 80,
    type: 'jpeg'
  });
});
```

#### Advanced Usage

```typescript
test('advanced screenshot scenarios', async ({ page, testInfo }) => {
  const screenshotHelper = new ScreenshotHelper(page, testInfo);
  
  // Masked screenshot (hide sensitive data)
  await screenshotHelper.takeMaskedScreenshot(
    ['.password-field', '.credit-card', '.ssn'],
    'secure-form',
    { maskColor: '#000000' }
  );
  
  // Comparison screenshot for visual testing
  await screenshotHelper.takeComparisonScreenshot('baseline-design');
  
  // Screenshot after network idle
  await screenshotHelper.takeScreenshotAfterNetworkIdle('loaded-page');
  
  // Responsive screenshots
  await screenshotHelper.takeScreenshotWithViewport(1920, 1080, 'desktop');
  await screenshotHelper.takeScreenshotWithViewport(768, 1024, 'tablet');
  await screenshotHelper.takeScreenshotWithViewport(375, 667, 'mobile');
  
  // Cleanup old screenshots (older than 7 days)
  await screenshotHelper.cleanupOldScreenshots(7);
});
```

#### Screenshot Options

```typescript
interface ScreenshotOptions {
  fullPage?: boolean;           // Capture full page
  clip?: {                      // Capture specific area
    x: number;
    y: number;
    width: number;
    height: number;
  };
  quality?: number;             // JPEG quality (0-100)
  type?: 'png' | 'jpeg';       // Image format
  animations?: 'disabled' | 'allow'; // Animation handling
  caret?: 'hide' | 'initial';   // Cursor visibility
  scale?: 'css' | 'device';     // Scaling method
  mask?: any[];                 // Elements to mask
  maskColor?: string;           // Mask color
  threshold?: number;           // Comparison threshold
  thresholdType?: 'pixel' | 'percent'; // Threshold type
}
```

### EmailService Class

The `EmailService` class provides automated email reporting with test results and attachments.

#### Key Features

- **Test Report Emails** - Automated test result reporting
- **Attachment Support** - Playwright reports and screenshots
- **Multiple Providers** - Gmail, Outlook, Office 365 support
- **HTML Templates** - Rich HTML email templates
- **Test Statistics** - Dynamic test result summaries

#### Basic Usage

```typescript
import { EmailService } from '../framework/utils/EmailService';

const emailService = EmailService.getInstance();

// Send test report
await emailService.sendTestReport(
  {
    email: true,
    to: ['team@example.com'],
    subject: 'Test Execution Report',
    body: 'Test execution completed successfully'
  },
  {
    smtp: true,
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: 'your-email@gmail.com',
      pass: 'your-app-password'
    }
  }
);
```

#### Advanced Usage

```typescript
// Send notification email
await emailService.sendNotification(
  emailConfig,
  smtpConfig,
  'Test suite completed with 95% pass rate'
);

// Initialize with provider-specific configuration
const providerConfig = {
  provider: 'outlook',
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  requiresAppPassword: false
};

await emailService.initializeTransporter(smtpConfig, providerConfig);
```

### DataHelper Class

The `DataHelper` class provides a simple and efficient way to load and access JSON test data files. It includes automatic caching to ensure optimal performance.

#### Key Features

- **Automatic Caching** - Data loaded once and cached for performance
- **Type Safety** - Full TypeScript support with generics
- **Simple API** - Direct access with clean syntax
- **Global Access** - Use `testData` constant for direct data access

#### Basic Usage

```typescript
import { DataHelper, testData } from '../../framework/utils/DataHelper';
import { LoginPage } from '../pages/LoginPage';

// Method 1: Using the DataHelper class
test('login with credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  // Load JSON data
  const users = DataHelper.loadJsonData('users.json');
  
  // Access data
  await loginPage.login(
    users.validUsers[0].username,
    users.validUsers[0].password
  );
});

// Method 2: Using the testData constant (RECOMMENDED)
export class LoginPage extends BasePage {
  constructor(page: Page, url?: string, testInfo?: TestInfo) {
    super(page, url, testInfo);
  }

  async loginWithTestData(): Promise<void> {
    // Direct access - no method calls needed!
    const username = testData.validUsers[0].mobileNumber;
    const password = testData.validUsers[0].password;
    
    await this.fill('#username', username);
    await this.fill('#password', password);
    await this.click('#login-btn');
  }

  async fillFormWithData(): Promise<void> {
    // Access nested data easily
    const firstName = testData.validUsers[0].firstName;
    const lastName = testData.validUsers[0].lastName;
    
    await this.fill('#first-name', firstName);
    await this.fill('#last-name', lastName);
  }
}
```

#### Advanced Usage

```typescript
// Load different data files
const users = DataHelper.loadJsonData('users.json');
const products = DataHelper.loadJsonData('products.json');
const config = DataHelper.loadJsonData('config.json');

// Use with type safety
interface User {
  username: string;
  password: string;
  email: string;
}

const typedUser = DataHelper.loadJsonData<User>('users.json');

// Access specific properties
const product = DataHelper.getData('products.json', 'electronics.laptops[0]');

// Clear cache if needed (rarely necessary)
DataHelper.clearCache();
```

#### Complete Example with Login Page

```typescript
import { Page, TestInfo } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';
import { LoginPageLocators } from '../locators/LoginPageLocators';
import { testData } from '../../framework/utils/DataHelper';

export interface LoginCredentials {
  mobileNumber: string;
  password: string;
  otp: string;
}

export class LoginPage extends BasePage {
  constructor(page: Page, url?: string, testInfo?: TestInfo) {
    super(page, url || defaultUrl, testInfo);
  }

  /**
   * Get valid user credentials - using testData!
   */
  public getValidUserCredentials(): LoginCredentials {
    const user = testData.validUsers[0];
    console.log(`✅ Using user: ${user.mobileNumber}`);
    return {
      mobileNumber: user.mobileNumber,
      password: user.password,
      otp: user.otp
    };
  }

  /**
   * Get invalid user credentials
   */
  public getInvalidUserCredentials() {
    return testData.invalidUsers[0];
  }

  /**
   * Perform login with test data
   */
  async loginWithValidCredentials(): Promise<void> {
    // Use testData directly
    const user = testData.validUsers[0];
    
    await this.fill(LoginPageLocators.mobileNumberField, user.mobileNumber);
    await this.fill(LoginPageLocators.passwordField, user.password);
    await this.click(LoginPageLocators.loginButton);
  }
}
```

#### JSON Data Structure Example

```json
// test/data/users.json
{
  "validUsers": [
    {
      "mobileNumber": "90336607",
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

#### Available Methods

| Method | Description | Example |
|--------|-------------|---------|
| `loadJsonData<T>(fileName)` | Load JSON data with caching | `const data = DataHelper.loadJsonData('users.json')` |
| `getData(fileName, path?)` | Get specific property | `const item = DataHelper.getData('config.json', 'api.endpoint')` |
| `clearCache()` | Clear cached data | `DataHelper.clearCache()` |

#### TestData Constant Properties

The `testData` constant provides direct access to commonly used data:

| Property | Description | Example |
|----------|-------------|---------|
| `testData.validUsers` | Array of valid test users | `testData.validUsers[0].mobileNumber` |
| `testData.invalidUsers` | Array of invalid users | `testData.invalidUsers[0].username` |
| `testData.users` | Complete users data object | `testData.users.validUsers[0]` |

### EnvConfig Class

The `EnvConfig` class manages environment-specific configuration and settings.

#### Key Features

- **Environment Management** - Switch between environments
- **SMTP Configuration** - Email provider settings
- **Dynamic Email Config** - Test result-based email configuration
- **Singleton Pattern** - Single instance across application

#### Basic Usage

```typescript
import { EnvConfig } from '../framework/utils/EnvConfig';

const envConfig = EnvConfig.getInstance();

// Get environment variables
const baseUrl = envConfig.get('BASE_URL', 'https://default.com');
const environment = envConfig.getEnvironment();

// Get SMTP configuration
const smtpConfig = envConfig.getSmtpConfig();

// Switch environment
EnvConfig.switchEnvironment('production');
```

#### Advanced Usage

```typescript
// Get dynamic email configuration based on test results
const testStats = { passed: 8, failed: 2, skipped: 0, total: 10 };
const emailConfig = envConfig.getDynamicEmailConfig(testStats, 'preprod');

// Get email provider configuration
const providerConfig = envConfig.getEmailProviderConfig();
console.log(providerConfig.provider); // 'gmail' or 'outlook'
console.log(providerConfig.requiresAppPassword); // true for Gmail
```

## Global Setup and Teardown

### Global Setup

The global setup runs before all tests and handles initial configuration.

```typescript
// framework/utils/globalSetup.ts
import { FullConfig } from '@playwright/test';
import { emailService } from './EmailService';

async function globalSetup(config: FullConfig) {
  console.log('Setting up email reporting...');
  
  const selectedProfile = (global as any).selectedProfile;
  
  if (selectedProfile?.reportEmail?.email && selectedProfile?.reportSmtp?.smtp) {
    try {
      await emailService.sendNotification(
        selectedProfile.reportEmail,
        selectedProfile.reportSmtp,
        'Test execution started'
      );
      console.log('Test start notification sent');
    } catch (error) {
      console.error('Failed to send test start notification:', error);
    }
  }
}

export default globalSetup;
```

### Global Teardown

The global teardown runs after all tests and sends final reports.

```typescript
// framework/utils/globalTeardown.ts
import { FullConfig } from '@playwright/test';
import { emailService } from './EmailService';
import { envConfig } from './EnvConfig';

async function globalTeardown(config: FullConfig) {
  console.log('Sending test report email with Playwright report...');
  
  const selectedProfile = (global as any).selectedProfile;
  
  if (selectedProfile?.reportEmail?.email && selectedProfile?.reportSmtp?.smtp) {
    const providerConfig = envConfig.getEmailProviderConfig();
    
    try {
      await emailService.sendTestReport(
        selectedProfile.reportEmail,
        selectedProfile.reportSmtp,
        providerConfig
      );
      console.log('Test report email sent successfully');
    } catch (error) {
      console.error('Failed to send test report email:', error);
    }
  }
}

export default globalTeardown;
```

## Best Practices

### 1. Page Object Pattern

```typescript
// Good: Use BasePage for all page objects
export class LoginPage extends BasePage {
  private readonly selectors = {
    username: '#username',
    password: '#password',
    submit: '#submit-btn'
  };

  constructor(page: Page, testInfo?: TestInfo) {
    super(page, 'https://example.com/login', testInfo);
  }

  async login(username: string, password: string): Promise<void> {
    await this.fill(this.selectors.username, username);
    await this.fill(this.selectors.password, password);
    await this.click(this.selectors.submit);
    await this.waitForNavigation();
  }
}
```

### 2. Test Organization

```typescript
// Good: Use BaseTest for test utilities
test.describe('User Management', () => {
  test('should create new user', async ({ page, context, logger, screenshotHelper }) => {
    const baseTest = new BaseTest(page, context, logger);
    const userPage = new UserPage(page, test.info());

    await baseTest.setup();
    
    try {
      await userPage.navigate();
      await userPage.createUser('John Doe', 'john@example.com');
      await baseTest.takeScreenshot('user-created');
    } finally {
      await baseTest.teardown();
    }
  });
});
```

### 3. Error Handling

```typescript
// Good: Comprehensive error handling
async performAction(): Promise<void> {
  try {
    await this.waitForVisible(this.selector);
    await this.click(this.selector);
  } catch (error) {
    this.logger.error('Action failed', error as Error);
    await this.takeScreenshot('action-failed');
    throw error;
  }
}
```

### 4. Logging Strategy

```typescript
// Good: Structured logging
logger.testStart('Login Test');
await logger.step('Navigate to login page', async () => {
  await loginPage.navigate();
});

await logger.step('Enter credentials', async () => {
  await loginPage.login('user', 'pass');
});

logger.testEnd('Login Test', true);
```

### 5. Test Data Management

```typescript
// Good: Use testData for clean and simple data access
import { testData } from '../../framework/utils/DataHelper';

export class LoginPage extends BasePage {
  async loginWithValidCredentials(): Promise<void> {
    // Direct access to test data - clean and simple!
    const user = testData.validUsers[0];
    
    await this.fill('#username', user.mobileNumber);
    await this.fill('#password', user.password);
    await this.click('#login-btn');
  }

  async performRegistration(): Promise<void> {
    // Access nested data easily
    const user = testData.validUsers[0];
    const address = user.address;
    
    await this.fill('#firstName', user.firstName);
    await this.fill('#lastName', user.lastName);
    await this.fill('#street', address.street);
    await this.fill('#city', address.city);
  }
}
```

## Configuration Examples

### Environment Configuration

```typescript
// .env file
BASE_URL=https://example.com
NODE_ENV=development
EMAIL_PROVIDER=gmail
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
LOG_LEVEL=INFO
```

### Profile Configuration

```typescript
// In playwright.config.ts
const PROFILES = {
  development: {
    baseURL: 'http://localhost:3000',
    browser: 'chrome',
    headless: false,
    reportEmail: {
      email: true,
      to: ['dev-team@example.com'],
      subject: 'Development Test Report',
      body: 'Development test execution completed'
    },
    reportSmtp: envConfig.getSmtpConfig()
  }
};
```

This framework provides a solid foundation for building robust, maintainable, and scalable Playwright test suites with comprehensive logging, reporting, and debugging capabilities.
