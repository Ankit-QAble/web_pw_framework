---
sidebar_position: 1
---

# Simple Test Example

This guide demonstrates a simple, beginner-friendly test example that you can use to understand and run tests with the framework. This example shows how to create a basic test using the Page Object Model pattern.

## Overview

The simple test example demonstrates:

- **Basic Test Structure** - How to write a simple test using the framework
- **Page Object Pattern** - Creating a page object that extends `BasePage`
- **Test Execution** - Using the logger for step-by-step test execution
- **Element Interactions** - Clicking and filling form elements

## Test File Structure

### Test Specification (`simpletest.spec.ts`)

```typescript
import { SimplePage } from '../pages/simplePage';
import { test, expect } from '../../framework/core/BaseTest';

test.describe('Simple Test Suite', () => {
  test('google test', { tag: ['@smoke'] }, async ({logger, page }, testInfo) => {
    const simplePage = new SimplePage(page, undefined, testInfo);
    
    await logger.step('Open the page', async () => {
      await simplePage.open();
    });
    
    await logger.step('Interact with search', async () => {
        await simplePage.googleClick();
        await simplePage.googleSearch();
      });
  });
});
```

### Key Components Explained

1. **Import Statements**
   - `SimplePage` - The page object class
   - `test, expect` - Test utilities from BaseTest

2. **Test Structure**
   - `test.describe()` - Groups related tests
   - `test()` - Individual test case
   - `{ tag: ['@smoke'] }` - Test tags for filtering
   - `{logger, page}` - Framework fixtures

3. **Logger Steps**
   - `logger.step()` - Creates organized test steps with logging
   - Each step is logged and can be tracked in reports

## Page Object Structure

### Page Object (`simplePage.ts`)

```typescript
import { Page, TestInfo } from '@playwright/test';
import { SimplePageLocators } from '../locators/simplePageLocator';
import { BasePage } from '../../framework/core/BasePage';

export class SimplePage extends BasePage {
    constructor(page: Page, url?: string, testInfo?: TestInfo) {
      // Use the URL from config or fallback to the provided URL
      const defaultUrl = (global as any).selectedProfile?.baseURL || process.env.BASE_URL;
      super(page, url || defaultUrl, testInfo);
    }

    /**
     * Open the page by navigating to the URL
     */
    async open(): Promise<void> {
        await this.navigate();
        await this.waitForPageLoad();
    }

    async googleClick(): Promise<void> {
        await this.click(SimplePageLocators.clickSearchCombobox);
        await this.takeScreenshot('google-click-failed');
    }

    async googleSearch(): Promise<void> {
        await this.fill(SimplePageLocators.searchCombobox, 'playwright agent');
    }
}
```

### Locators File (`simplePageLocator.ts`)

```typescript
export const SimplePageLocators = {
  clickSearchCombobox: 'textarea[name="q"]',
  searchCombobox: 'textarea[name="q"]'
};
```

### Key Concepts

1. **Extending BasePage**
   - `SimplePage` extends `BasePage` to inherit all framework functionality
   - Constructor accepts `page`, optional `url`, and `testInfo`

2. **URL Configuration**
   - Uses global profile or environment variable for base URL
   - Falls back to provided URL if available

3. **Page Methods**
   - `open()` - Navigates and waits for page load
   - `googleClick()` - Clicks the search box and takes screenshot
   - `googleSearch()` - Fills the search box with text

4. **Locator Management**
   - Locators are stored separately for maintainability
   - Can be easily updated without changing test logic

## Running the Test

### Run with Playwright

```bash
# Run the specific test file
npx playwright test test/specs/simpletest.spec.ts

# Run with UI mode
npx playwright test test/specs/simpletest.spec.ts --ui

# Run with specific tag
npx playwright test --grep @smoke

# Run in headed mode (see browser)
npx playwright test test/specs/simpletest.spec.ts --headed

# Run with specific browser
npx playwright test test/specs/simpletest.spec.ts --project=chromium
```

### Run with Debug Mode

```bash
# Debug mode with Playwright Inspector
npx playwright test test/specs/simpletest.spec.ts --debug
```

## Test Flow

1. **Test Initialization**
   - Test receives `logger` and `page` fixtures
   - `SimplePage` is instantiated with page and testInfo

2. **Step 1: Open the Page**
   - Navigates to the configured URL (Google)
   - Waits for page to fully load

3. **Step 2: Interact with Search**
   - Clicks the search textarea
   - Takes a screenshot for verification
   - Fills the search box with "playwright agent"

## What This Example Demonstrates

### ✅ Best Practices Shown

1. **Page Object Model**
   - Separates page logic from test logic
   - Makes tests readable and maintainable

2. **Structured Logging**
   - Uses `logger.step()` for clear test organization
   - Each step is tracked in test reports

3. **Locator Management**
   - Centralized locator definitions
   - Easy to update selectors

4. **Screenshot Integration**
   - Automatic screenshots on actions
   - Helps with debugging failures

5. **Test Tags**
   - Uses `@smoke` tag for test categorization
   - Enables selective test execution

### 📋 Framework Features Used

- **BasePage** - Inherits element interaction methods
- **Logger** - Step-by-step test logging
- **Screenshots** - Automatic screenshot capture
- **Wait Strategies** - `waitForPageLoad()` for page readiness
- **Element Actions** - `click()` and `fill()` methods

## Customizing the Test

### Change the Search Query

```typescript
async googleSearch(searchText: string): Promise<void> {
    await this.fill(SimplePageLocators.searchCombobox, searchText);
}
```

Then in your test:
```typescript
await simplePage.googleSearch('your custom search');
```

### Add More Actions

```typescript
async submitSearch(): Promise<void> {
    await this.pressKey(SimplePageLocators.searchCombobox, 'Enter');
}

async verifySearchResults(): Promise<void> {
    await this.waitForVisible('#search-results');
    await this.takeScreenshot('search-results');
}
```

### Add Assertions

```typescript
await logger.step('Verify search results', async () => {
    const resultsCount = await simplePage.getText('#result-stats');
    expect(resultsCount).toContain('results');
});
```

## File Structure

```
test/
├── specs/
│   └── simpletest.spec.ts      # Test specification
├── pages/
│   └── simplePage.ts           # Page object
└── locators/
    └── simplePageLocator.ts    # Locator definitions
```

## Capturing Console Logs and Network Requests

The framework provides built-in capabilities to capture and save console logs and network requests to files.

### Example: Adding Monitoring to Simple Test

```typescript
import { SimplePage } from '../pages/simplePage';
import { test, expect } from '../../framework/core/BaseTest';

test.describe('Simple Test Suite', () => {
  test('google test with monitoring', { tag: ['@smoke'] }, async ({logger, page }, testInfo) => {
    const simplePage = new SimplePage(page, undefined, testInfo);
    
    // Start capturing console logs and network requests
    await logger.step('Start capturing', async () => {
      await simplePage.startCapturingConsoleLogs();
      await simplePage.startCapturingNetworkRequests();
    });
    
    await logger.step('Open the page', async () => {
      await simplePage.open();
    });
    
    await logger.step('Interact with search', async () => {
        await simplePage.googleClick();
        await simplePage.googleSearch();
      });
    
    // Save all captured data to files in log/ folder
    await logger.step('Save captured data', async () => {
      const files = await simplePage.saveAllCapturedData();
      logger.info(`Console logs saved to: ${files.consoleLogs}`);
      logger.info(`Network requests saved to: ${files.networkRequests}`);
    });
  });
});
```

### What Gets Saved

When you run the test, the following files are created in the `log/` folder:

- **console-logs_SimplePage_<timestamp>.txt** - All browser console logs
- **console-errors_SimplePage_<timestamp>.txt** - Only console errors
- **network-requests_SimplePage_<timestamp>.txt** - All network requests with details
- **network-errors_SimplePage_<timestamp>.txt** - Only failed network requests

These files contain detailed information including:
- Timestamps
- Request/response headers and bodies
- Status codes and durations
- Summary statistics

### Accessing Captured Data Programmatically

You can also access the captured data in your test for assertions:

```typescript
// Check for console errors
const errors = simplePage.getConsoleErrors();
expect(errors.length).toBe(0);

// Check for failed network requests
const failedRequests = simplePage.getFailedNetworkRequests();
expect(failedRequests.length).toBe(0);

// Get network summary
const summary = simplePage.getNetworkRequestSummary();
console.log(`Total requests: ${summary.total}`);
```

For more details, see [BasePage Examples - Console and Network Monitoring](./basepage-examples.md#pattern-6-capturing-console-logs-and-saving-to-files).

## Next Steps

After understanding this simple test, you can:

1. **Explore More Examples**
   - Check out [BasePage Examples](./basepage-examples.md)
   - Review [BaseTest Examples](./basetest-examples.md)

2. **Add More Tests**
   - Create additional test cases
   - Add more page objects

3. **Enhance Your Tests**
   - Add assertions and verifications
   - Implement data-driven testing
   - Add error handling
   - Add console and network monitoring

4. **Learn Advanced Features**
   - [File Upload Examples](./file-upload.md)
   - [Iframe Handling](./iframe-handling.md)
   - [Grid Examples](./grid-example.md)

## Troubleshooting

### Test Fails to Find Elements

- Verify locators are correct
- Check if page has loaded completely
- Ensure selectors match the current page structure

### URL Not Loading

- Check `BASE_URL` environment variable
- Verify global profile configuration
- Ensure network connectivity

### Screenshots Not Generated

- Check screenshot directory permissions
- Verify `testInfo` is passed to page object
- Review framework configuration

## Summary

This simple test example provides a foundation for understanding:

- ✅ How to structure tests with the framework
- ✅ How to create page objects extending BasePage
- ✅ How to use the logger for organized test steps
- ✅ How to interact with web elements
- ✅ How to run and debug tests

Use this example as a starting point for building more complex test suites!

