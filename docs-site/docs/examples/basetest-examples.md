---
sidebar_position: 3
---

# BaseTest Test Examples

This comprehensive guide provides real-world test examples demonstrating how to use the `BaseTest` class in your Playwright test suites.

## Table of Contents

- [Overview](#overview)
- [BaseTest Examples](#basetest-examples)
- [Complete Test Scenarios](#complete-test-scenarios)
- [Best Practices](#best-practices)
- [Common Patterns](#common-patterns)

## Overview

`BaseTest` provides test-level utilities and fixtures for comprehensive test management. It includes:

- **Test Fixtures** - Pre-configured logger and screenshot helper
- **Keyboard Operations** - Complete keyboard interaction support
- **Browser Management** - Viewport, navigation, and data management
- **Dialog Handling** - Alert, confirm, and prompt handling
- **JavaScript Execution** - Custom script execution in browser context
- **Test Lifecycle** - Setup and teardown methods for test initialization

## BaseTest Examples

### Example 1: Basic Test with BaseTest

```typescript
import { test, expect, BaseTest } from '../../framework/core/BaseTest';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login Tests', () => {
  let loginPage: LoginPage;
  let baseTest: BaseTest;

  test.beforeEach(async ({ page, context, logger }, testInfo) => {
    // Initialize BaseTest
    baseTest = new BaseTest(page, context, logger);
    await baseTest.setup();
    
    // Initialize LoginPage
    loginPage = new LoginPage(page, 'https://example.com/login', testInfo);
  });

  test.afterEach(async ({ logger }) => {
    if (baseTest) {
      await baseTest.teardown();
    }
  });

  test('should login successfully', async ({ logger }) => {
    await logger.step('Navigate to login page', async () => {
      await loginPage.navigateToLogin();
    });

    await logger.step('Enter credentials and login', async () => {
      await loginPage.login('testuser', 'password123');
    });

    await logger.step('Verify successful login', async () => {
      const currentUrl = baseTest.getCurrentUrl();
      expect(currentUrl).toContain('/dashboard');
      
      const pageTitle = await baseTest.getPageTitle();
      expect(pageTitle).toContain('Dashboard');
    });
  });
});
```

### Example 2: Custom BaseTest with Setup/Teardown

```typescript
import { test, expect, BaseTest } from '../../framework/core/BaseTest';
import { DemoPage } from '../pages/DemoPage';

const APP_URL = process.env.APP_URL || 'https://example.com';

/**
 * Custom BaseTest class with specific setup and teardown
 */
class CustomTest extends BaseTest {
  /**
   * Override setup method for custom initialization
   */
  override async setup(): Promise<void> {
    await super.setup();
    
    // Clear browser data before each test
    await this.clearBrowserData();
    
    // Set specific viewport size
    await this.setViewportSize(1920, 1080);
    
    this.logger.info('Custom test setup completed');
  }

  /**
   * Override teardown method for cleanup
   */
  override async teardown(): Promise<void> {
    // Take screenshot before teardown
    await this.takeScreenshot('test-completed');
    
    await super.teardown();
    this.logger.info('Custom test teardown completed');
  }
}

test.describe('Application Tests', () => {
  let demoPage: DemoPage;
  let customTest: CustomTest;

  test.beforeEach(async ({ page, context, logger }, testInfo) => {
    customTest = new CustomTest(page, context, logger);
    await customTest.setup();

    demoPage = new DemoPage(page, APP_URL, testInfo);
  });

  test.afterEach(async ({ logger }) => {
    if (customTest) {
      await customTest.teardown();
    }
  });

  test('should complete user workflow', async ({ logger }) => {
    await logger.step('Navigate to application', async () => {
      await customTest.navigateTo(APP_URL);
      await demoPage.verifyPageLoaded();
    });

    await logger.step('Perform actions', async () => {
      await demoPage.performAction();
    });

    await logger.step('Verify results', async () => {
      const pageTitle = await customTest.getPageTitle();
      expect(pageTitle).toContain('Success');
    });
  });
});
```

### Example 3: Keyboard Operations with BaseTest

```typescript
import { test, expect, BaseTest } from '../../framework/core/BaseTest';
import { FormPage } from '../pages/FormPage';

test.describe('Keyboard Operations Tests', () => {
  let formPage: FormPage;
  let baseTest: BaseTest;

  test.beforeEach(async ({ page, context, logger }, testInfo) => {
    baseTest = new BaseTest(page, context, logger);
    await baseTest.setup();
    
    formPage = new FormPage(page, 'https://example.com/form', testInfo);
    await formPage.navigate();
  });

  test.afterEach(async () => {
    if (baseTest) {
      await baseTest.teardown();
    }
  });

  test('should navigate form using keyboard', async ({ logger }) => {
    await logger.step('Fill form using keyboard navigation', async () => {
      // Focus first field
      await formPage.focusFirstName();
      
      // Type text
      await baseTest.typeText('John');
      
      // Navigate to next field using Tab
      await baseTest.pressTab();
      
      // Type last name
      await baseTest.typeText('Doe');
      
      // Select all text using Ctrl+A
      await baseTest.pressCtrlA();
      
      // Copy text using Ctrl+C
      await baseTest.pressCtrlC();
      
      // Navigate to email field
      await baseTest.pressTab();
      
      // Paste using Ctrl+V
      await baseTest.pressCtrlV();
      
      // Navigate back using Arrow keys
      await baseTest.pressArrowLeft();
      await baseTest.pressArrowRight();
    });

    await logger.step('Submit form using Enter', async () => {
      await baseTest.pressEnter();
      await baseTest.wait(2000); // Wait for submission
    });
  });

  test('should handle keyboard shortcuts', async ({ logger }) => {
    await logger.step('Test function keys', async () => {
      // Refresh page using F5
      await baseTest.pressF5();
      await baseTest.wait(2000);
      
      // Open developer tools using F12 (if needed)
      // await baseTest.pressF12();
    });

    await logger.step('Test text editing shortcuts', async () => {
      await formPage.focusTextField();
      
      // Type some text
      await baseTest.typeText('Test text');
      
      // Select all
      await baseTest.pressCtrlA();
      
      // Cut text
      await baseTest.pressCtrlX();
      
      // Navigate to another field
      await baseTest.pressTab();
      
      // Paste text
      await baseTest.pressCtrlV();
      
      // Undo using Ctrl+Z
      await baseTest.pressCtrlZ();
    });
  });

  test('should type text with different speeds', async ({ logger }) => {
    await formPage.focusTextField();
    
    // Type normally
    await baseTest.typeText('Normal speed');
    
    // Type slowly (100ms delay between keystrokes)
    await baseTest.typeTextSlowly('Slow typing');
    
    // Type very slowly (200ms delay between keystrokes)
    await baseTest.typeTextVerySlowly('Very slow typing');
    
    // Type with custom delay
    await baseTest.typeText('Custom delay', 50); // 50ms delay
  });

  test('should use arrow keys for navigation', async ({ logger }) => {
    await formPage.focusTextField();
    
    // Navigate using arrow keys
    await baseTest.pressArrowUp();
    await baseTest.pressArrowDown();
    await baseTest.pressArrowLeft();
    await baseTest.pressArrowRight();
    
    // Navigate to beginning/end
    await baseTest.pressHome();
    await baseTest.pressEnd();
    
    // Page navigation
    await baseTest.pressPageUp();
    await baseTest.pressPageDown();
  });
}
```

### Example 4: Browser Management with BaseTest

```typescript
import { test, expect, BaseTest } from '../../framework/core/BaseTest';
import { HomePage } from '../pages/HomePage';

test.describe('Browser Management Tests', () => {
  let homePage: HomePage;
  let baseTest: BaseTest;

  test.beforeEach(async ({ page, context, logger }, testInfo) => {
    baseTest = new BaseTest(page, context, logger);
    await baseTest.setup();
    
    homePage = new HomePage(page, 'https://example.com', testInfo);
  });

  test.afterEach(async () => {
    if (baseTest) {
      await baseTest.teardown();
    }
  });

  test('should test responsive design', async ({ logger }) => {
    await logger.step('Test desktop viewport', async () => {
      await baseTest.setViewportSize(1920, 1080);
      await baseTest.navigateTo('https://example.com');
      await baseTest.takeScreenshot('desktop-view');
    });

    await logger.step('Test tablet viewport', async () => {
      await baseTest.setViewportSize(768, 1024);
      await baseTest.reloadPage();
      await baseTest.takeScreenshot('tablet-view');
    });

    await logger.step('Test mobile viewport', async () => {
      await baseTest.setViewportSize(375, 667);
      await baseTest.reloadPage();
      await baseTest.takeScreenshot('mobile-view');
    });
  });

  test('should navigate browser history', async ({ logger }) => {
    await logger.step('Navigate through pages', async () => {
      await baseTest.navigateTo('https://example.com/page1');
      await baseTest.wait(1000);
      
      await baseTest.navigateTo('https://example.com/page2');
      await baseTest.wait(1000);
      
      await baseTest.navigateTo('https://example.com/page3');
      await baseTest.wait(1000);
    });

    await logger.step('Go back in history', async () => {
      await baseTest.goBack();
      const url = baseTest.getCurrentUrl();
      expect(url).toContain('page2');
    });

    await logger.step('Go forward in history', async () => {
      await baseTest.goForward();
      const url = baseTest.getCurrentUrl();
      expect(url).toContain('page3');
    });
  });

  test('should clear browser data', async ({ logger }) => {
    await logger.step('Set cookies and permissions', async () => {
      await baseTest.navigateTo('https://example.com');
      // Application sets cookies
      await baseTest.wait(2000);
    });

    await logger.step('Clear browser data', async () => {
      await baseTest.clearBrowserData();
      await baseTest.reloadPage();
      // Verify cookies are cleared
    });
  });

  test('should reload page', async ({ logger }) => {
    await baseTest.navigateTo('https://example.com');
    await baseTest.wait(2000);
    
    // Reload page
    await baseTest.reloadPage();
    
    // Verify page reloaded
    const url = baseTest.getCurrentUrl();
    expect(url).toContain('example.com');
  });
});
```

### Example 5: JavaScript Execution with BaseTest

```typescript
import { test, expect, BaseTest } from '../../framework/core/BaseTest';
import { DashboardPage } from '../pages/DashboardPage';

test.describe('JavaScript Execution Tests', () => {
  let dashboardPage: DashboardPage;
  let baseTest: BaseTest;

  test.beforeEach(async ({ page, context, logger }, testInfo) => {
    baseTest = new BaseTest(page, context, logger);
    await baseTest.setup();
    
    dashboardPage = new DashboardPage(page, 'https://example.com/dashboard', testInfo);
    await dashboardPage.navigate();
  });

  test('should execute JavaScript in browser', async ({ logger }) => {
    await logger.step('Get page information', async () => {
      // Get document ready state
      const readyState = await baseTest.executeScript('return document.readyState;');
      expect(readyState).toBe('complete');
      
      // Get window location
      const location = await baseTest.executeScript('return window.location.href;');
      expect(location).toContain('dashboard');
      
      // Get page title
      const title = await baseTest.executeScript('return document.title;');
      expect(title).toBeTruthy();
    });

    await logger.step('Execute function with parameters', async () => {
      // Execute function with parameters
      const result = await baseTest.executeScript(
        (a: number, b: number) => a + b,
        10,
        20
      );
      expect(result).toBe(30);
    });

    await logger.step('Modify DOM elements', async () => {
      // Hide an element
      await baseTest.executeScript(() => {
        const element = document.querySelector('.sidebar');
        if (element) {
          (element as HTMLElement).style.display = 'none';
        }
      });
      
      // Verify element is hidden
      const isVisible = await dashboardPage.isSidebarVisible();
      expect(isVisible).toBeFalsy();
    });

    await logger.step('Get computed styles', async () => {
      const backgroundColor = await baseTest.executeScript(() => {
        const element = document.querySelector('.header');
        if (element) {
          return window.getComputedStyle(element).backgroundColor;
        }
        return null;
      });
      
      expect(backgroundColor).toBeTruthy();
    });

    await logger.step('Get element properties', async () => {
      const scrollHeight = await baseTest.executeScript(() => {
        return document.documentElement.scrollHeight;
      });
      
      expect(scrollHeight).toBeGreaterThan(0);
    });
  });
});
```

### Example 6: Dialog Handling with BaseTest

```typescript
import { test, expect, BaseTest } from '../../framework/core/BaseTest';
import { ConfirmationPage } from '../pages/ConfirmationPage';

test.describe('Dialog Handling Tests', () => {
  let confirmationPage: ConfirmationPage;
  let baseTest: BaseTest;

  test.beforeEach(async ({ page, context, logger }, testInfo) => {
    baseTest = new BaseTest(page, context, logger);
    await baseTest.setup();
    
    confirmationPage = new ConfirmationPage(page, 'https://example.com/confirm', testInfo);
  });

  test('should handle alert dialog', async ({ logger, page }) => {
    await logger.step('Setup dialog handler', async () => {
      // Accept alert dialog
      await baseTest.handleDialog(true);
    });

    await logger.step('Trigger alert', async () => {
      await confirmationPage.clickDeleteButton();
      // Dialog will be automatically accepted
    });
  });

  test('should handle confirm dialog', async ({ logger, page }) => {
    await logger.step('Accept confirm dialog', async () => {
      await baseTest.handleDialog(true);
      await confirmationPage.clickConfirmButton();
    });

    await logger.step('Dismiss confirm dialog', async () => {
      await baseTest.handleDialog(false);
      await confirmationPage.clickConfirmButton();
    });
  });

  test('should handle prompt dialog', async ({ logger, page }) => {
    await logger.step('Handle prompt with input', async () => {
      await baseTest.handleDialog(true, 'User Input');
      await confirmationPage.clickPromptButton();
      // Dialog will be accepted with 'User Input' text
    });
  });
});
```

### Example 7: Complete Keyboard Shortcuts

```typescript
import { test, expect, BaseTest } from '../../framework/core/BaseTest';

test.describe('Keyboard Shortcuts Tests', () => {
  let baseTest: BaseTest;

  test.beforeEach(async ({ page, context, logger }) => {
    baseTest = new BaseTest(page, context, logger);
    await baseTest.setup();
    await baseTest.navigateTo('https://example.com');
  });

  test('should use all function keys', async () => {
    await baseTest.pressF1();
    await baseTest.pressF2();
    await baseTest.pressF3();
    await baseTest.pressF4();
    await baseTest.pressF5(); // Refresh
    await baseTest.pressF6();
    await baseTest.pressF7();
    await baseTest.pressF8();
    await baseTest.pressF9();
    await baseTest.pressF10();
    await baseTest.pressF11();
    await baseTest.pressF12();
  });

  test('should use Ctrl shortcuts', async () => {
    await baseTest.pressCtrlA(); // Select All
    await baseTest.pressCtrlC(); // Copy
    await baseTest.pressCtrlV(); // Paste
    await baseTest.pressCtrlX(); // Cut
    await baseTest.pressCtrlZ(); // Undo
    await baseTest.pressCtrlY(); // Redo
    await baseTest.pressCtrlS(); // Save
    await baseTest.pressCtrlF(); // Find
  });

  test('should use key combinations', async () => {
    await baseTest.pressKeyCombination('Control+Shift+A');
    await baseTest.pressKeyCombination('Alt+Tab');
    await baseTest.pressKeyCombination('Meta+C');
  });

  test('should press multiple keys in sequence', async () => {
    await baseTest.pressKeys(['Enter', 'Tab', 'Escape']);
  });
});
```

## Complete Test Scenarios

### Scenario 1: Complete E-Commerce Test Flow

```typescript
import { test, expect, BaseTest } from '../../framework/core/BaseTest';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';

test.describe('E-Commerce Complete Flow', () => {
  let loginPage: LoginPage;
  let productPage: ProductPage;
  let cartPage: CartPage;
  let checkoutPage: CheckoutPage;
  let baseTest: BaseTest;

  test.beforeEach(async ({ page, context, logger }, testInfo) => {
    baseTest = new BaseTest(page, context, logger);
    await baseTest.setup();
    
    // Clear browser data for fresh start
    await baseTest.clearBrowserData();
    await baseTest.setViewportSize(1920, 1080);
  });

  test.afterEach(async () => {
    if (baseTest) {
      await baseTest.takeScreenshot('test-completed');
      await baseTest.teardown();
    }
  });

  test('should complete full purchase flow', async ({ logger }) => {
    // Step 1: Login
    await logger.step('Login to application', async () => {
      loginPage = new LoginPage(page, 'https://example.com/login', testInfo);
      await loginPage.navigateToLogin();
      await loginPage.login('testuser', 'password123');
      await loginPage.verifyDashboardPage();
    });

    // Step 2: Browse and select product
    await logger.step('Browse and select product', async () => {
      productPage = new ProductPage(page, 'https://example.com/products', testInfo);
      await productPage.navigate();
      await productPage.verifyProductDetails('Test Product', '$99.99');
      await productPage.addToCart();
    });

    // Step 3: View cart
    await logger.step('View cart', async () => {
      cartPage = new CartPage(page, 'https://example.com/cart', testInfo);
      await cartPage.navigate();
      await cartPage.verifyProductInCart('Test Product');
      await cartPage.clickCheckout();
    });

    // Step 4: Checkout
    await logger.step('Complete checkout', async () => {
      checkoutPage = new CheckoutPage(page, 'https://example.com/checkout', testInfo);
      await checkoutPage.fillShippingInfo({
        name: 'John Doe',
        address: '123 Main St',
        city: 'New York',
        zip: '10001'
      });
      await checkoutPage.fillPaymentInfo({
        cardNumber: '4111111111111111',
        expiryDate: '12/25',
        cvv: '123'
      });
      await checkoutPage.submitOrder();
      await checkoutPage.verifyOrderConfirmation();
    });

    // Step 5: Verify order
    await logger.step('Verify order details', async () => {
      const orderNumber = await checkoutPage.getOrderNumber();
      expect(orderNumber).toBeTruthy();
      
      const pageTitle = await baseTest.getPageTitle();
      expect(pageTitle).toContain('Order Confirmation');
    });
  });
});
```

### Scenario 2: Form Filling with Keyboard Navigation

```typescript
import { test, expect, BaseTest } from '../../framework/core/BaseTest';
import { RegistrationPage } from '../pages/RegistrationPage';

test.describe('Form Filling with Keyboard', () => {
  let registrationPage: RegistrationPage;
  let baseTest: BaseTest;

  test.beforeEach(async ({ page, context, logger }, testInfo) => {
    baseTest = new BaseTest(page, context, logger);
    await baseTest.setup();
    
    registrationPage = new RegistrationPage(page, 'https://example.com/register', testInfo);
    await registrationPage.navigate();
  });

  test('should fill form using keyboard only', async ({ logger }) => {
    await logger.step('Fill form fields using keyboard', async () => {
      // Focus first field
      await registrationPage.focusFirstName();
      
      // Type first name
      await baseTest.typeText('John');
      await baseTest.pressTab();
      
      // Type last name
      await baseTest.typeText('Doe');
      await baseTest.pressTab();
      
      // Type email
      await baseTest.typeText('john.doe@example.com');
      await baseTest.pressTab();
      
      // Type password
      await baseTest.typeText('SecurePassword123!');
      await baseTest.pressTab();
      
      // Confirm password (copy from previous field)
      await baseTest.pressCtrlA(); // Select all in password field
      await baseTest.pressCtrlC(); // Copy
      await baseTest.pressTab(); // Move to confirm password
      await baseTest.pressCtrlV(); // Paste
    });

    await logger.step('Navigate dropdown using keyboard', async () => {
      await baseTest.pressTab(); // Focus dropdown
      await baseTest.pressSpace(); // Open dropdown
      await baseTest.pressArrowDown(); // Navigate options
      await baseTest.pressArrowDown();
      await baseTest.pressEnter(); // Select option
    });

    await logger.step('Submit form', async () => {
      await baseTest.pressTab(); // Move to submit button
      await baseTest.pressEnter(); // Submit
      
      await baseTest.wait(2000);
      await registrationPage.verifyRegistrationSuccess();
    });
  });
});
```

### Scenario 3: Responsive Design Testing

```typescript
import { test, expect, BaseTest } from '../../framework/core/BaseTest';
import { HomePage } from '../pages/HomePage';

test.describe('Responsive Design Tests', () => {
  let homePage: HomePage;
  let baseTest: BaseTest;

  test.beforeEach(async ({ page, context, logger }, testInfo) => {
    baseTest = new BaseTest(page, context, logger);
    await baseTest.setup();
    
    homePage = new HomePage(page, 'https://example.com', testInfo);
  });

  test('should test all viewport sizes', async ({ logger }) => {
    const viewports = [
      { name: 'Desktop', width: 1920, height: 1080 },
      { name: 'Laptop', width: 1366, height: 768 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Mobile Large', width: 425, height: 667 },
      { name: 'Mobile Small', width: 375, height: 667 }
    ];

    for (const viewport of viewports) {
      await logger.step(`Test ${viewport.name} viewport`, async () => {
        await baseTest.setViewportSize(viewport.width, viewport.height);
        await baseTest.navigateTo('https://example.com');
        await baseTest.wait(1000); // Wait for layout to adjust
        await baseTest.takeScreenshot(`${viewport.name.toLowerCase()}-view`);
        
        // Verify page loaded correctly
        const pageTitle = await baseTest.getPageTitle();
        expect(pageTitle).toBeTruthy();
      });
    }
  });
});
```

## Best Practices

### 1. Test Organization

**✅ Good:**
```typescript
test.describe('Login Tests', () => {
  let loginPage: LoginPage;
  let baseTest: BaseTest;

  test.beforeEach(async ({ page, context, logger }, testInfo) => {
    baseTest = new BaseTest(page, context, logger);
    await baseTest.setup();
    loginPage = new LoginPage(page, url, testInfo);
  });

  test.afterEach(async () => {
    await baseTest.teardown();
  });
});
```

### 2. Custom BaseTest Class

**✅ Good:**
```typescript
class MyAppTest extends BaseTest {
  override async setup(): Promise<void> {
    await super.setup();
    await this.clearBrowserData();
    await this.setViewportSize(1920, 1080);
  }

  override async teardown(): Promise<void> {
    await this.takeScreenshot('test-completed');
    await super.teardown();
  }
}
```

### 3. Logging

**✅ Good:**
```typescript
await logger.step('Login to application', async () => {
  await loginPage.login('user', 'pass');
});

await logger.step('Verify dashboard', async () => {
  await dashboardPage.verifyLoaded();
});
```

### 4. Screenshots

**✅ Good:**
```typescript
try {
  await this.performAction();
  await baseTest.takeScreenshot('action-success');
} catch (error) {
  await baseTest.takeScreenshot('action-failed');
  throw error;
}
```

### 5. Browser Management

**✅ Good:**
```typescript
// Set viewport before navigation
await baseTest.setViewportSize(1920, 1080);
await baseTest.navigateTo('https://example.com');

// Clear data when needed
await baseTest.clearBrowserData();
```

## Common Patterns

### Pattern 1: Custom BaseTest Class

```typescript
class MyAppTest extends BaseTest {
  override async setup(): Promise<void> {
    await super.setup();
    await this.clearBrowserData();
    await this.setViewportSize(1920, 1080);
  }

  override async teardown(): Promise<void> {
    await this.takeScreenshot('test-completed');
    await super.teardown();
  }
}
```

### Pattern 2: Keyboard-Only Testing

```typescript
test('should be accessible via keyboard', async ({ logger }) => {
  await baseTest.pressTab(); // Navigate through focusable elements
  await baseTest.pressEnter(); // Activate elements
  await baseTest.pressEscape(); // Close modals
});
```

### Pattern 3: JavaScript Execution for Complex Scenarios

```typescript
// Get page metrics
const metrics = await baseTest.executeScript(() => {
  return {
    scrollHeight: document.documentElement.scrollHeight,
    clientHeight: document.documentElement.clientHeight,
    scrollTop: window.pageYOffset
  };
});

// Modify page state
await baseTest.executeScript(() => {
  localStorage.setItem('test-mode', 'enabled');
});
```

### Pattern 4: Dialog Handling Pattern

```typescript
// Setup dialog handler before action
await baseTest.handleDialog(true); // Accept
await page.click('#delete-button');
// Dialog automatically handled
```

### Pattern 5: Responsive Testing Pattern

```typescript
const viewports = [
  { name: 'desktop', width: 1920, height: 1080 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'mobile', width: 375, height: 667 }
];

for (const viewport of viewports) {
  await baseTest.setViewportSize(viewport.width, viewport.height);
  await baseTest.navigateTo(url);
  await baseTest.takeScreenshot(`${viewport.name}-view`);
}
```

## Summary

`BaseTest` provides comprehensive test-level utilities including:

- **Test Lifecycle** - Setup and teardown methods
- **Keyboard Operations** - Complete keyboard interaction support
- **Browser Management** - Viewport, navigation, history, data clearing
- **Dialog Handling** - Alert, confirm, and prompt handling
- **JavaScript Execution** - Custom script execution in browser context
- **Screenshot Management** - Test-level screenshot capabilities

By following these examples and best practices, you can build robust, maintainable, and scalable test suites with the framework.

