---
sidebar_position: 2
---

# BasePage Test Examples

This comprehensive guide provides real-world test examples demonstrating how to use the `BasePage` class in your Playwright test suites.

## Table of Contents

- [Overview](#overview)
- [BasePage Examples](#basepage-examples)
- [Complete Test Scenarios](#complete-test-scenarios)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)

## Overview

`BasePage` is the foundation for all page objects in the framework. It provides:

- **Element Interactions** - Click, fill, select, and verify elements
- **Wait Strategies** - Multiple wait conditions for different scenarios
- **Screenshot Integration** - Automatic screenshots on failures
- **Comprehensive Logging** - Detailed logging for all actions
- **Error Handling** - Graceful error handling with descriptive messages
- **Auto-Healing Selectors** - Fallback selectors for resilient tests
- **Iframe Support** - Handle elements inside iframes
- **File Upload** - Direct and button-triggered file uploads
- **Console Log Capture** - Capture and analyze browser console logs
- **Network Request Capture** - Monitor and analyze network requests/responses

## BasePage Examples

### Example 1: Basic Page Object with BasePage

```typescript
import { Page, TestInfo } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';

export class LoginPage extends BasePage {
  // Define locators as private readonly properties
  private readonly usernameField = '#username';
  private readonly passwordField = '#password';
  private readonly loginButton = '#login-btn';
  private readonly errorMessage = '.error-message';
  private readonly successMessage = '.success-message';

  constructor(page: Page, url?: string, testInfo?: TestInfo) {
    super(page, url || 'https://example.com/login', testInfo);
  }

  /**
   * Navigate to login page
   */
  async navigateToLogin(): Promise<void> {
    await this.navigate();
    await this.waitForPageLoad();
  }

  /**
   * Enter username
   */
  async enterUsername(username: string): Promise<void> {
    await this.waitForVisible(this.usernameField);
    await this.fill(this.usernameField, username);
  }

  /**
   * Enter password
   */
  async enterPassword(password: string): Promise<void> {
    await this.waitForVisible(this.passwordField);
    await this.fill(this.passwordField, password);
  }

  /**
   * Click login button
   */
  async clickLoginButton(): Promise<void> {
    await this.waitUntilElementClickable(this.loginButton);
    await this.click(this.loginButton);
  }

  /**
   * Complete login flow
   */
  async login(username: string, password: string): Promise<void> {
    this.logger.info(`Attempting login for user: ${username}`);
    
    try {
      await this.enterUsername(username);
      await this.enterPassword(password);
      await this.clickLoginButton();
      await this.waitForNavigation();
      
      this.logger.info('Login completed successfully');
      await this.takeScreenshot('login-success');
    } catch (error) {
      this.logger.error('Login failed', error as Error);
      await this.takeScreenshot('login-failed');
      throw error;
    }
  }

  /**
   * Verify error message
   */
  async verifyErrorMessage(expectedMessage: string): Promise<void> {
    await this.waitForVisible(this.errorMessage);
    await this.verifyText(this.errorMessage, expectedMessage);
  }

  /**
   * Verify login page elements are present
   */
  async verifyLoginPageElements(): Promise<void> {
    await this.waitForVisible(this.usernameField);
    await this.waitForVisible(this.passwordField);
    await this.waitForVisible(this.loginButton);
    this.logger.info('All login page elements verified');
  }
}
```

### Example 2: Advanced Page Object with Auto-Healing Selectors

```typescript
import { Page, TestInfo } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';

export class DashboardPage extends BasePage {
  // Auto-healing selectors: framework tries each selector until one works
  private readonly userMenu = [
    '#user-menu',
    '[data-testid="user-menu"]',
    '.user-dropdown',
    '//div[@class="user-menu"]'
  ];
  
  private readonly logoutButton = [
    '#logout-btn',
    '[data-testid="logout"]',
    '//button[contains(text(), "Logout")]'
  ];

  constructor(page: Page, url?: string, testInfo?: TestInfo) {
    super(page, url || 'https://example.com/dashboard', testInfo);
  }

  /**
   * Open user menu with auto-healing selector
   */
  async openUserMenu(): Promise<void> {
    // BasePage will try each selector in the array until one works
    await this.waitForVisible(this.userMenu);
    await this.click(this.userMenu);
    this.logger.info('User menu opened');
  }

  /**
   * Logout with auto-healing selector
   */
  async logout(): Promise<void> {
    await this.openUserMenu();
    await this.waitForVisible(this.logoutButton);
    await this.click(this.logoutButton);
    await this.waitForNavigation();
    this.logger.info('Logout completed');
  }

  /**
   * Verify dashboard loaded
   */
  async verifyDashboardLoaded(): Promise<void> {
    await this.waitForPageLoad();
    const title = await this.getTitle();
    expect(title).toContain('Dashboard');
    this.logger.info('Dashboard verified');
  }
}
```

### Example 3: Page Object with Iframe Handling

```typescript
import { Page, TestInfo } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';

export class DocumentUploadPage extends BasePage {
  private readonly uploadIframe = 'iframe#document-upload';
  private readonly uploadButton = '//button[normalize-space()="Upload"]';
  private readonly continueButton = '//button[normalize-space()="Continue"]';
  private readonly successMessage = '.upload-success';

  constructor(page: Page, url?: string, testInfo?: TestInfo) {
    super(page, url || 'https://example.com/upload', testInfo);
  }

  /**
   * Upload file inside iframe
   */
  async uploadDocumentInIframe(filePath: string): Promise<void> {
    try {
      this.logger.info('Starting document upload in iframe');
      
      // Wait for iframe to be available
      await this.waitForVisible(this.uploadIframe, 10000);
      
      // Upload file via button click inside iframe
      await this.uploadFileViaButtonInFrame(
        this.uploadIframe,
        this.uploadButton,
        filePath,
        15000 // timeout for file chooser
      );
      
      this.logger.info('File uploaded successfully');
      await this.takeScreenshot('file-uploaded-in-iframe');
      
      // Wait for processing
      await this.waitForTimeout(5000);
      
      // Click continue button inside iframe
      await this.clickInFrame(
        this.uploadIframe,
        this.continueButton,
        10000
      );
      
      // Verify success message
      await this.waitForVisible(this.successMessage, 30000);
      this.logger.info('Document upload completed successfully');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.logger.error(`Document upload failed: ${errorMessage}`);
      await this.takeScreenshot('document-upload-failed');
      throw new Error(`Document upload failed: ${errorMessage}`);
    }
  }

  /**
   * Fill form field inside iframe
   */
  async fillFieldInIframe(fieldSelector: string, value: string): Promise<void> {
    await this.fillInFrame(
      this.uploadIframe,
      fieldSelector,
      value,
      10000
    );
  }

  /**
   * Wait for element inside iframe
   */
  async waitForElementInIframe(elementSelector: string): Promise<void> {
    await this.waitForVisibleInFrame(
      this.uploadIframe,
      elementSelector,
      10000
    );
  }
}
```

### Example 4: Page Object with File Upload

```typescript
import { Page, TestInfo } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';

export class ProfilePage extends BasePage {
  private readonly avatarUploadButton = '#avatar-upload-btn';
  private readonly documentUploadInput = '#document-upload';
  private readonly saveButton = '#save-profile';

  constructor(page: Page, url?: string, testInfo?: TestInfo) {
    super(page, url || 'https://example.com/profile', testInfo);
  }

  /**
   * Upload avatar via button click (opens file dialog)
   */
  async uploadAvatar(imagePath: string): Promise<void> {
    try {
      this.logger.info('Uploading avatar image');
      
      // Wait for upload button
      await this.waitForVisible(this.avatarUploadButton, 10000);
      
      // Upload file via button (handles file dialog)
      await this.uploadFileViaButton(
        this.avatarUploadButton,
        imagePath,
        15000
      );
      
      this.logger.info('Avatar uploaded successfully');
      await this.takeScreenshot('avatar-uploaded');
      
    } catch (error) {
      this.logger.error('Avatar upload failed', error as Error);
      await this.takeScreenshot('avatar-upload-failed');
      throw error;
    }
  }

  /**
   * Upload document via direct file input
   */
  async uploadDocument(documentPath: string): Promise<void> {
    try {
      this.logger.info('Uploading document');
      
      // Wait for file input
      await this.waitForVisible(this.documentUploadInput, 10000);
      
      // Upload file directly to input element
      await this.uploadFile(
        this.documentUploadInput,
        documentPath,
        10000
      );
      
      this.logger.info('Document uploaded successfully');
      
    } catch (error) {
      this.logger.error('Document upload failed', error as Error);
      throw error;
    }
  }

  /**
   * Upload multiple documents
   */
  async uploadMultipleDocuments(filePaths: string[]): Promise<void> {
    await this.uploadFile(
      this.documentUploadInput,
      filePaths, // Array of file paths
      15000
    );
    this.logger.info(`Uploaded ${filePaths.length} documents`);
  }
}
```

### Example 5: Page Object with Text Verification

```typescript
import { Page, TestInfo } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';
import { expect } from '@playwright/test';

export class ProductPage extends BasePage {
  private readonly productTitle = '.product-title';
  private readonly productPrice = '.product-price';
  private readonly addToCartButton = '#add-to-cart';
  private readonly cartCount = '.cart-count';

  constructor(page: Page, url?: string, testInfo?: TestInfo) {
    super(page, url || 'https://example.com/products', testInfo);
  }

  /**
   * Verify product details
   */
  async verifyProductDetails(expectedTitle: string, expectedPrice: string): Promise<void> {
    // Exact match verification
    await this.verifyText(this.productTitle, expectedTitle, true);
    
    // Partial match verification
    const actualPrice = await this.getText(this.productPrice);
    expect(actualPrice).toContain(expectedPrice);
    
    this.logger.info('Product details verified');
  }

  /**
   * Get text and compare (non-asserting)
   */
  async checkProductTitle(expectedTitle: string): Promise<boolean> {
    const matches = await this.getTextAndCompare(
      this.productTitle,
      expectedTitle,
      true // exact match
    );
    
    if (matches) {
      this.logger.info('Product title matches');
    } else {
      this.logger.warn('Product title does not match');
    }
    
    return matches;
  }

  /**
   * Add product to cart and verify
   */
  async addToCart(): Promise<void> {
    const initialCount = await this.getText(this.cartCount);
    const initialCountNum = parseInt(initialCount) || 0;
    
    await this.click(this.addToCartButton);
    await this.waitForTimeout(1000); // Wait for cart update
    
    const newCount = await this.getText(this.cartCount);
    const newCountNum = parseInt(newCount) || 0;
    
    expect(newCountNum).toBe(initialCountNum + 1);
    this.logger.info('Product added to cart successfully');
  }
}
```

### Example 6: Page Object with Navigation and URL Verification

```typescript
import { Page, TestInfo } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';
import { expect } from '@playwright/test';

export class CheckoutPage extends BasePage {
  private readonly orderConfirmation = '.order-confirmation';
  private readonly orderNumber = '.order-number';

  constructor(page: Page, url?: string, testInfo?: TestInfo) {
    super(page, url || 'https://example.com/checkout', testInfo);
  }

  /**
   * Navigate with retry logic
   */
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

  /**
   * Verify page title
   */
  async verifyPageTitle(expectedTitle: string): Promise<void> {
    await this.verifyTitle(expectedTitle);
  }

  /**
   * Verify URL contains text
   */
  async verifyUrlContains(expectedText: string): Promise<void> {
    await this.verifyUrlContains(expectedText);
  }

  /**
   * Get current URL
   */
  getCurrentPageUrl(): string {
    return this.getCurrentUrl();
  }
}
```

### Example 7: Page Object with Dropdown Selection

```typescript
import { Page, TestInfo } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';

export class FormPage extends BasePage {
  private readonly countryDropdown = '#country';
  private readonly stateDropdown = '#state';
  private readonly submitButton = '#submit-btn';

  constructor(page: Page, url?: string, testInfo?: TestInfo) {
    super(page, url || 'https://example.com/form', testInfo);
  }

  /**
   * Select country from dropdown
   */
  async selectCountry(countryValue: string): Promise<void> {
    await this.waitForVisible(this.countryDropdown);
    await this.selectOption(this.countryDropdown, countryValue);
    this.logger.info(`Selected country: ${countryValue}`);
  }

  /**
   * Select state from dropdown
   */
  async selectState(stateValue: string): Promise<void> {
    await this.waitForVisible(this.stateDropdown);
    await this.selectOption(this.stateDropdown, stateValue);
    this.logger.info(`Selected state: ${stateValue}`);
  }

  /**
   * Submit form
   */
  async submitForm(): Promise<void> {
    await this.waitUntilElementClickable(this.submitButton);
    await this.click(this.submitButton);
    await this.waitForNavigation();
    this.logger.info('Form submitted successfully');
  }
}
```

## Complete Test Scenarios

### Scenario 1: Complete Login Flow with BasePage

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login Flow Tests', () => {
  test('should login successfully', async ({ page }, testInfo) => {
    const loginPage = new LoginPage(page, 'https://example.com/login', testInfo);
    
    // Navigate to login page
    await loginPage.navigateToLogin();
    
    // Verify login page elements
    await loginPage.verifyLoginPageElements();
    
    // Perform login
    await loginPage.login('testuser', 'password123');
    
    // Verify successful login (assuming dashboard page)
    const currentUrl = loginPage.getCurrentUrl();
    expect(currentUrl).toContain('/dashboard');
  });

  test('should show error on invalid credentials', async ({ page }, testInfo) => {
    const loginPage = new LoginPage(page, 'https://example.com/login', testInfo);
    
    await loginPage.navigateToLogin();
    await loginPage.enterUsername('invalid');
    await loginPage.enterPassword('wrong');
    await loginPage.clickLoginButton();
    
    // Verify error message
    await loginPage.verifyErrorMessage('Invalid username or password');
  });
});
```

### Scenario 2: File Upload Workflow with BasePage

```typescript
import { test, expect } from '@playwright/test';
import { DocumentUploadPage } from '../pages/DocumentUploadPage';
import { ProfilePage } from '../pages/ProfilePage';

test.describe('File Upload Tests', () => {
  test('should upload documents successfully', async ({ page }, testInfo) => {
    const uploadPage = new DocumentUploadPage(page, 'https://example.com/upload', testInfo);
    
    await uploadPage.navigate();
    
    // Upload document via button
    await uploadPage.uploadDocumentInIframe(
      'E:/Project/web_pw_framework/test-document.pdf'
    );
    
    // Verify upload success
    await uploadPage.waitForElementInIframe('.upload-success');
  });

  test('should upload multiple files', async ({ page }, testInfo) => {
    const profilePage = new ProfilePage(page, 'https://example.com/profile', testInfo);
    
    await profilePage.navigate();
    
    // Upload multiple documents
    await profilePage.uploadMultipleDocuments([
      'E:/Project/web_pw_framework/doc1.pdf',
      'E:/Project/web_pw_framework/doc2.pdf',
      'E:/Project/web_pw_framework/doc3.pdf'
    ]);
  });
});
```

### Scenario 3: E-Commerce Product Flow

```typescript
import { test, expect } from '@playwright/test';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';

test.describe('E-Commerce Product Tests', () => {
  test('should add product to cart', async ({ page }, testInfo) => {
    const productPage = new ProductPage(page, 'https://example.com/products', testInfo);
    
    await productPage.navigate();
    
    // Verify product details
    await productPage.verifyProductDetails('Test Product', '$99.99');
    
    // Add to cart
    await productPage.addToCart();
    
    // Verify cart count increased
    const cartCount = await productPage.getText('.cart-count');
    expect(parseInt(cartCount)).toBeGreaterThan(0);
  });
});
```

## Best Practices

### 1. Page Object Pattern

**✅ Good:**
```typescript
export class LoginPage extends BasePage {
  private readonly usernameField = '#username';
  
  async login(username: string, password: string): Promise<void> {
    await this.fill(this.usernameField, username);
    await this.fill(this.passwordField, password);
    await this.click(this.loginButton);
  }
}
```

**❌ Bad:**
```typescript
test('login test', async ({ page }) => {
  await page.fill('#username', 'user');
  await page.fill('#password', 'pass');
  await page.click('#login-btn');
});
```

### 2. Error Handling

**✅ Good:**
```typescript
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

### 3. Wait Strategies

**✅ Good:**
```typescript
async clickButton(): Promise<void> {
  // Wait for element to be clickable before clicking
  await this.waitUntilElementClickable(this.button);
  await this.click(this.button);
}
```

### 4. Screenshots

**✅ Good:**
```typescript
try {
  await this.performAction();
  await this.takeScreenshot('action-success');
} catch (error) {
  await this.takeScreenshot('action-failed');
  throw error;
}
```

### 5. Logging

**✅ Good:**
```typescript
async login(username: string, password: string): Promise<void> {
  this.logger.info(`Attempting login for user: ${username}`);
  await this.fill(this.usernameField, username);
  this.logger.info('Login completed successfully');
}
```

## Common Patterns

### Pattern 1: Page Object with Data Helper

```typescript
import { testData } from '../../framework/utils/DataHelper';

export class LoginPage extends BasePage {
  async loginWithTestData(): Promise<void> {
    const user = testData.validUsers[0];
    await this.login(user.mobileNumber, user.password);
  }
}
```

### Pattern 2: Retry Logic

```typescript
async navigateWithRetry(maxRetries: number = 3): Promise<void> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await this.navigate();
      return;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await this.waitForTimeout(2000);
    }
  }
}
```

### Pattern 3: Conditional Actions

```typescript
async performActionIfVisible(): Promise<void> {
  const isVisible = await this.isVisible(this.selector);
  if (isVisible) {
    await this.click(this.selector);
  } else {
    this.logger.warn('Element not visible, skipping action');
  }
}
```

### Pattern 4: Auto-Healing Selectors

```typescript
export class DynamicPage extends BasePage {
  // Framework will try each selector until one works
  private readonly dynamicButton = [
    '#primary-button',
    '[data-testid="submit-btn"]',
    '.btn-primary',
    '//button[contains(text(), "Submit")]'
  ];

  async clickDynamicButton(): Promise<void> {
    // BasePage automatically tries all selectors
    await this.click(this.dynamicButton);
  }
}
```

### Pattern 5: Page Object with Verification Methods

```typescript
export class DashboardPage extends BasePage {
  async verifyPageLoaded(): Promise<void> {
    await this.waitForPageLoad();
    await this.waitForVisible('.dashboard-content');
    const title = await this.getTitle();
    expect(title).toContain('Dashboard');
  }
}
```

### Pattern 6: Capturing Console Logs and Saving to Files

```typescript
import { Page, TestInfo } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';

export class DebugPage extends BasePage {
  constructor(page: Page, url?: string, testInfo?: TestInfo) {
    super(page, url || 'https://example.com', testInfo);
  }

  /**
   * Capture console logs and save to file
   */
  async captureAndSaveConsoleLogs(): Promise<void> {
    // Start capturing all console logs
    await this.captureConsoleLogs();
    
    // Perform actions that might generate console logs
    await this.navigate();
    await this.performSomeAction();
    
    // Save all console logs to file in log/ folder
    const logFile = await this.saveConsoleLogsToFile();
    this.logger.info(`Console logs saved to: ${logFile}`);
    
    // Save only errors to separate file
    const errorFile = await this.saveConsoleErrorsToFile();
    this.logger.info(`Console errors saved to: ${errorFile}`);
    
    // Check for console errors programmatically
    const errors = this.getConsoleErrors();
    if (errors.length > 0) {
      this.logger.error(`Found ${errors.length} console errors - see ${errorFile}`);
      throw new Error('Console errors detected');
    }
    
    // Stop capturing
    this.stopCapturingConsoleLogs();
  }

  /**
   * Capture only errors and warnings, then save to file
   */
  async captureErrorsAndWarnings(): Promise<void> {
    await this.captureConsoleLogs(['error', 'warning']);
    
    // Your test actions...
    await this.performSomeAction();
    
    // Save errors to file
    await this.saveConsoleErrorsToFile();
    
    this.stopCapturingConsoleLogs();
  }
}
```

**File Output Location:**
- Console logs are saved to `log/console-logs_<ClassName>_<timestamp>.txt`
- Console errors are saved to `log/console-errors_<ClassName>_<timestamp>.txt`
- Files include timestamps, locations, and formatted content

### Pattern 7: Capturing Network Requests and Saving to Files

```typescript
import { Page, TestInfo } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';

export class ApiTestPage extends BasePage {
  constructor(page: Page, url?: string, testInfo?: TestInfo) {
    super(page, url || 'https://example.com', testInfo);
  }

  /**
   * Monitor API calls and save to file
   */
  async monitorApiCalls(): Promise<void> {
    // Start capturing network requests
    await this.captureNetworkRequests();
    
    // Perform actions that trigger API calls
    await this.navigate();
    await this.submitForm();
    
    // Wait for network activity to complete
    await this.waitForPageLoad();
    
    // Save all network requests to file
    const requestsFile = await this.saveNetworkRequestsToFile();
    this.logger.info(`Network requests saved to: ${requestsFile}`);
    
    // Save failed requests to separate file
    const failedFile = await this.saveFailedNetworkRequestsToFile();
    this.logger.info(`Failed requests saved to: ${failedFile}`);
    
    // Check for failed requests programmatically
    const failedRequests = this.getFailedNetworkRequests();
    if (failedRequests.length > 0) {
      this.logger.error(`Found ${failedRequests.length} failed requests - see ${failedFile}`);
    }
    
    // Get network summary
    const summary = this.getNetworkRequestSummary();
    this.logger.info(`Network Summary: ${summary.total} total, ${summary.successful} successful, ${summary.failed} failed`);
    this.logger.info(`Average duration: ${summary.averageDuration}ms`);
    
    // Stop capturing
    this.stopCapturingNetworkRequests();
  }

  /**
   * Monitor specific API endpoint and save to file
   */
  async monitorSpecificApi(endpointPattern: string): Promise<void> {
    // Capture only requests matching the pattern
    await this.captureNetworkRequests(endpointPattern);
    
    // Perform actions...
    await this.triggerApiCall();
    
    // Save captured requests to file
    await this.saveNetworkRequestsToFile();
    
    // Verify API was called programmatically
    const apiRequests = this.getNetworkRequestsByUrl(endpointPattern);
    if (apiRequests.length === 0) {
      throw new Error(`Expected API call to ${endpointPattern} was not made`);
    }
    
    // Verify API response
    const apiRequest = apiRequests[0];
    if (apiRequest.status !== 200) {
      throw new Error(`API call failed with status ${apiRequest.status}`);
    }
    
    this.stopCapturingNetworkRequests();
  }

  /**
   * Monitor POST requests only and save to file
   */
  async monitorPostRequests(): Promise<void> {
    await this.captureNetworkRequests(undefined, 'POST');
    
    await this.submitForm();
    
    // Save POST requests to file
    await this.saveNetworkRequestsToFile();
    
    this.stopCapturingNetworkRequests();
  }
}
```

**File Output Location:**
- Network requests are saved to `log/network-requests_<ClassName>_<timestamp>.txt`
- Failed network requests are saved to `log/network-errors_<ClassName>_<timestamp>.txt`
- Files include request/response headers, bodies, status codes, durations, and summary statistics

### Pattern 8: Complete Test with Console and Network Monitoring (File-Based)

```typescript
import { test, expect } from '../../framework/core/BaseTest';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login with Monitoring', () => {
  test('should login without console errors or failed requests', async ({ page, logger }, testInfo) => {
    const loginPage = new LoginPage(page, undefined, testInfo);
    
    // Start capturing console logs and network requests
    await loginPage.captureConsoleLogs();
    await loginPage.captureNetworkRequests();
    
    await logger.step('Navigate to login page', async () => {
      await loginPage.open();
    });
    
    await logger.step('Perform login', async () => {
      await loginPage.login('username', 'password');
    });
    
    await logger.step('Save all captured data to files', async () => {
      // Save all captured data to files in log/ folder
      const files = await loginPage.saveAllCapturedDataToFiles();
      
      logger.info(`Console logs saved to: ${files.consoleLogs}`);
      logger.info(`Console errors saved to: ${files.consoleErrors}`);
      logger.info(`Network requests saved to: ${files.networkRequests}`);
      logger.info(`Failed network requests saved to: ${files.failedRequests}`);
    });
    
    await logger.step('Verify no console errors', async () => {
      const errors = loginPage.getConsoleErrors();
      expect(errors.length).toBe(0);
    });
    
    await logger.step('Verify no failed network requests', async () => {
      const failedRequests = loginPage.getFailedNetworkRequests();
      expect(failedRequests.length).toBe(0);
    });
    
    await logger.step('Verify login API was called successfully', async () => {
      const loginRequests = loginPage.getNetworkRequestsByUrl(/\/api\/login/);
      expect(loginRequests.length).toBeGreaterThan(0);
      expect(loginRequests[0].status).toBe(200);
    });
    
    // Stop capturing
    loginPage.stopCapturingConsoleLogs();
    loginPage.stopCapturingNetworkRequests();
  });
});
```

**Key Features:**
- All captured data is automatically saved to text files in the `log/` folder
- Files are timestamped and include page class name for easy identification
- You can still access data programmatically for assertions
- Files contain detailed information including headers, bodies, timestamps, and summaries

## Console Log and Network Request File Saving

### Overview

The framework automatically saves captured console logs and network requests to text files in the `log/` folder. This provides persistent records of browser activity for debugging and analysis.

### File Saving Methods

#### Console Log Methods

- `saveConsoleLogsToFile(fileName?)` - Saves all captured console logs to a text file
- `saveConsoleErrorsToFile(fileName?)` - Saves only console errors to a text file
- Returns the file path where data was saved

#### Network Request Methods

- `saveNetworkRequestsToFile(fileName?)` - Saves all captured network requests to a text file
- `saveFailedNetworkRequestsToFile(fileName?)` - Saves only failed requests (status >= 400) to a text file
- Returns the file path where data was saved

#### Combined Method

- `saveAllCapturedDataToFiles(prefix?)` - Saves all captured data (console logs, errors, network requests, failed requests) to separate files
- Returns an object with paths to all saved files:
  ```typescript
  {
    consoleLogs: string;
    consoleErrors: string;
    networkRequests: string;
    failedRequests: string;
  }
  ```

### File Naming Convention

Files are automatically named with the following pattern:
- `console-logs_<ClassName>_<timestamp>.txt`
- `console-errors_<ClassName>_<timestamp>.txt`
- `network-requests_<ClassName>_<timestamp>.txt`
- `network-errors_<ClassName>_<timestamp>.txt`

Example: `console-logs_LoginPage_2024-01-01_12-00-00.txt`

### File Contents

#### Console Log Files Include:
- All captured console messages (log, debug, info, warning, error)
- Location information (URL, line number, column number)
- Timestamps for each log entry
- Summary by log type

#### Network Request Files Include:
- Request method, URL, and timestamp
- Response status code and status text
- Request/response headers
- Request/response bodies (JSON parsed when possible)
- Request duration in milliseconds
- Resource type
- Summary statistics (total, successful, failed, pending, average duration)
- Methods breakdown

### Usage Example

```typescript
import { Page, TestInfo } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';

export class MyPage extends BasePage {
  async testWithMonitoring(): Promise<void> {
    // Start capturing
    await this.captureConsoleLogs();
    await this.captureNetworkRequests();
    
    // Perform test actions
    await this.navigate();
    await this.performActions();
    
    // Save all data to files
    const files = await this.saveAllCapturedDataToFiles();
    this.logger.info(`Data saved to: ${JSON.stringify(files, null, 2)}`);
    
    // Or save individually
    const consoleLogFile = await this.saveConsoleLogsToFile();
    const networkFile = await this.saveNetworkRequestsToFile();
    
    // Stop capturing
    this.stopCapturingConsoleLogs();
    this.stopCapturingNetworkRequests();
  }
}
```

### Accessing Data Programmatically

Even though data is saved to files, you can still access it programmatically for assertions:

```typescript
// Get console errors
const errors = this.getConsoleErrors();
expect(errors.length).toBe(0);

// Get failed network requests
const failed = this.getFailedNetworkRequests();
expect(failed.length).toBe(0);

// Get network summary
const summary = this.getNetworkRequestSummary();
console.log(`Total requests: ${summary.total}`);
```

## Summary

`BasePage` provides a robust foundation for building page objects with:

- **Element Interactions** - Click, fill, select, verify
- **Wait Strategies** - Multiple wait conditions
- **Error Handling** - Graceful error handling with screenshots
- **Logging** - Comprehensive logging for debugging
- **Auto-Healing** - Fallback selectors for resilient tests
- **Iframe Support** - Handle elements inside iframes
- **File Upload** - Direct and button-triggered uploads
- **Console Log Capture** - Capture and save browser console logs to files in `log/` folder
- **Network Request Capture** - Monitor and save network requests/responses to files in `log/` folder

By following these examples and best practices, you can build maintainable and scalable page objects with the framework.

