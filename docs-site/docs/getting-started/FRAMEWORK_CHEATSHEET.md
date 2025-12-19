---
sidebar_position: 5
---

# Framework Cheatsheet

This reference guide provides code snippets for common tasks using the framework's core utilities: `BasePage`, `BaseTest`, `DataHelper`, `Logger`, and `ScreenshotHelper`.

## BasePage Methods

The `BasePage` class wraps Playwright actions with built-in logging, error handling, and auto-waiting.

### Navigation & Page Control

```typescript
// Navigate to a URL
await this.navigateTo('https://example.com');

// Reload the page
await this.reloadPage();

// Browser history
await this.goBack();
await this.goForward();

// Set viewport size
await this.setViewportSize(1920, 1080);

// Clear cookies and permissions
await this.clearBrowserData();
```

### Element Interaction

```typescript
import { LoginPageLocators } from '../locators/LoginPageLocators';

// Click an element
await this.click(LoginPageLocators.submitButton);

// Fill a form field
await this.fill(LoginPageLocators.usernameField, 'myuser');

// Select an option from a dropdown
await this.selectOption(LoginPageLocators.countryDropdown, 'US');

// Check visibility
const isVisible = await this.isVisible(LoginPageLocators.alertMessage);

// Get text content
const text = await this.getText(LoginPageLocators.headerTitle);

// Wait for element to be visible
await this.waitForVisible(LoginPageLocators.modalDialog);

// Wait for element to be clickable
await this.waitUntilElementClickable(LoginPageLocators.submitButton);
```

### Assertions (Soft & Hard)

```typescript
// Verify text match (Hard Assertion - stops test on failure)
await this.verifyText(LoginPageLocators.statusLabel, 'Active');

// Verify text contains substring
await this.verifyText(LoginPageLocators.successMessage, 'Success', false); // false = contains match

// Verify Title
await this.verifyTitle('Dashboard - My App');

// Text Comparison with Soft Assertion support
// (Returns boolean, logs error but doesn't stop test if softAssert=true)
const isMatch = await this.getTextAndCompare(
  LoginPageLocators.heroTitle, 
  'Expected Title', 
  true, // exact match
  true  // soft assertion
);
```

### Iframe Handling

```typescript
// Click element inside iframe
await this.clickInFrame(LoginPageLocators.uploadIframe, LoginPageLocators.innerButton);

// Fill input inside iframe
await this.fillInFrame(LoginPageLocators.uploadIframe, LoginPageLocators.innerInput, 'value');

// Get Frame object for custom actions
const frame = await this.getFrame(LoginPageLocators.uploadIframe);
await frame.locator(LoginPageLocators.innerElement).click();
```

### Keyboard Actions

```typescript
// Common keys
await this.pressEnter();
await this.pressTab();
await this.pressEscape();
await this.pressSpace();

// Shortcuts
await this.pressCtrlC(); // Copy
await this.pressCtrlV(); // Paste
await this.pressCtrlA(); // Select All

// Typing
await this.typeText('Hello World');
await this.typeTextSlowly('Slow Typing'); // 100ms delay
```

### Console & Network Monitoring

```typescript
// Start capturing console logs (defaults to all levels if unspecified)
await this.captureConsoleLogs(['error', 'warning']);

// Start capturing network traffic
await this.captureNetworkRequests();
// or with filters: await this.captureNetworkRequests(/api/, 'POST');

// ... perform test actions ...

// Verify no console errors occurred
const errors = this.getConsoleErrors();
expect(errors.length).toBe(0);

// Check network statistics
const summary = this.getNetworkRequestSummary();
console.log(`Total: ${summary.total}, Failed: ${summary.failed}`);

// Get specific failed requests
const failedReqs = this.getFailedNetworkRequests();
if (failedReqs.length > 0) {
  console.log(`Failed URL: ${failedReqs[0].url}`);
}

// Save capture reports to 'log/' folder
await this.saveConsoleErrorsToFile('my-test-console-errors.txt');
await this.saveFailedNetworkRequestsToFile('my-test-network-errors.txt');

// Save ALL captured data (console logs, errors, network requests, failures)
// Returns an object with paths to all generated files
const reportPaths = await this.saveAllCapturedDataToFiles('my-test-report');
console.log(`Full report saved at: ${reportPaths.consoleLogs}`);
```

## BaseTest & Fixtures

Extend `BaseTest` to get access to pre-configured fixtures like `logger` and `screenshotHelper`.

```typescript
import { test, expect } from '../framework/core/BaseTest';
import { LoginPage } from '../pages/LoginPage';

test('My Test Case', async ({ page, logger, screenshotHelper }) => {
  logger.info('Starting test execution');
  
  const loginPage = new LoginPage(page);
  await loginPage.open();
  
  await screenshotHelper.takeScreenshot('login-page');
});
```

## Data Helper

Load test data from JSON, CSV, or Excel files located in `test/data/`.

```typescript
import { DataHelper, getData, getFirst } from '../framework/utils/DataHelper';

// Load entire JSON file
const userData = DataHelper.loadJsonData('users.json');

// Get specific property (supports dot notation)
const validUser = getData('users.json', 'validUsers[0]');

// Get first item from an array property
const product = getFirst('products.json', 'electronics');

// Load CSV Data
const records = DataHelper.loadCsvData('data.csv');

// Load Excel Data
const sheetData = DataHelper.loadExcelData('report.xlsx', 'Sheet1');
```

## Logger

Use the `Logger` to add structured logs to your test output.

```typescript
// Log levels
this.logger.info('Navigating to homepage');
this.logger.debug('User ID: 12345');
this.logger.warn('Retry attempt 1');
this.logger.error('Login failed', errorObject);

// Log a step (wraps execution with start/end logs)
await this.logger.step('Submit Login Form', async () => {
  await this.fill(LoginPageLocators.usernameField, 'admin');
  await this.click(LoginPageLocators.loginButton);
});

// Log API details
this.logger.apiRequest('POST', '/api/login', { user: 'admin' });
this.logger.apiResponse(200, 150, { token: 'xyz' });
```

## Screenshots & Visual Comparison

The `ScreenshotHelper` handles capturing and comparing images.

### Taking Screenshots

```typescript
// Full page screenshot
await this.screenshotHelper.takeScreenshot('homepage');

// Element screenshot
await this.screenshotHelper.takeElementScreenshot(LoginPageLocators.headerSection, 'header-section');

// Masked screenshot (hides sensitive elements)
await this.screenshotHelper.takeMaskedScreenshot([LoginPageLocators.passwordField, LoginPageLocators.creditCardField], 'payment-step');

// Failure screenshot (usually called automatically in teardown)
await this.screenshotHelper.takeFailureScreenshot();
```

### Visual Regression Testing

Compares the current view against a baseline image. First run creates the baseline.

```typescript
// Compare full page
const result = await this.screenshotHelper.compareWithBaseline('homepage-visual', {
  threshold: 0.05, // 5% difference allowed
  thresholdType: 'percent'
});

expect(result.passed).toBeTruthy();

// Compare specific element
const element = page.locator(LoginPageLocators.sidebar);
await this.screenshotHelper.compareElementWithBaseline(element, 'sidebar-visual');
```
### Console & Network Capturing

```typescript
//Start capturing console logs and save to file
async startCapturingConsoleLogs(): Promise<void> {
    await this.captureConsoleLogs();
}
//Start capturing network requests and save to file
async startCapturingNetworkRequests(): Promise<void> {
    await this.captureNetworkRequests();
}
//Save all captured console logs to file
async saveConsoleLogs(): Promise<string> {
    return await this.saveConsoleLogsToFile();
}

//Save console errors to file
async saveConsoleErrors(): Promise<string> {
    return await this.saveConsoleErrorsToFile();
}

//Save network requests to file
async saveNetworkRequests(): Promise<string> {
    return await this.saveNetworkRequestsToFile();
}

//Save failed network requests to file
async saveFailedNetworkRequests(): Promise<string> {
    return await this.saveFailedNetworkRequestsToFile();
}


 //Save all captured data (console logs and network requests) to files
async saveAllCapturedData(): Promise<{
        consoleLogs: string;
        consoleErrors: string;
        networkRequests: string;
        failedRequests: string;
}> {
    return await this.saveAllCapturedDataToFiles();
}
```