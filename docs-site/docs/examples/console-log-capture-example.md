---
sidebar_position: 7
---

# Console Log Capture Example

This guide demonstrates how to capture browser console logs and save them to files for debugging and analysis.

## Overview

The framework provides built-in capabilities to capture browser console logs (log, debug, info, warning, error) and automatically save them to text files in the `log/` folder. This helps identify JavaScript errors, warnings, and debug information during test execution.

## Table of Contents

- [Quick Start](#quick-start)
- [Basic Usage](#basic-usage)
- [Complete Examples](#complete-examples)
- [File Output](#file-output)
- [Best Practices](#best-practices)

## Quick Start

```typescript
import { Page, TestInfo } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';

export class MyPage extends BasePage {
  async testWithConsoleCapture(): Promise<void> {
    // Start capturing console logs
    await this.captureConsoleLogs();
    
    // Perform test actions
    await this.navigate();
    await this.performActions();
    
    // Save console logs to file
    const logFile = await this.saveConsoleLogsToFile();
    this.logger.info(`Console logs saved to: ${logFile}`);
    
    // Stop capturing
    this.stopCapturingConsoleLogs();
  }
}
```

## Basic Usage

### Start Capturing Console Logs

```typescript
// Capture all console log levels
await this.captureConsoleLogs();

// Capture only errors and warnings
await this.captureConsoleLogs(['error', 'warning']);

// Capture specific levels
await this.captureConsoleLogs(['error', 'warning', 'info']);
```

### Save Console Logs to File

```typescript
// Save all console logs
const logFile = await this.saveConsoleLogsToFile();

// Save only console errors
const errorFile = await this.saveConsoleErrorsToFile();

// Custom file name
const customFile = await this.saveConsoleLogsToFile('my-custom-logs.txt');
```

### Access Captured Data Programmatically

```typescript
// Get all console logs
const logs = this.getConsoleLogs();

// Get only errors
const errors = this.getConsoleErrors();

// Get only warnings
const warnings = this.getConsoleWarnings();

// Filter by type
const infoLogs = this.getConsoleLogs('info');
```

## Complete Examples

### Example 1: Basic Console Log Capture

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
    
    // Save all console logs to file
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
}
```

### Example 2: Test with Console Error Verification

```typescript
import { test, expect } from '../../framework/core/BaseTest';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login Tests with Console Monitoring', () => {
  test('should login without console errors', async ({ page, logger }, testInfo) => {
    const loginPage = new LoginPage(page, undefined, testInfo);
    
    // Start capturing console logs
    await loginPage.captureConsoleLogs();
    
    await logger.step('Navigate to login page', async () => {
      await loginPage.open();
    });
    
    await logger.step('Perform login', async () => {
      await loginPage.login('username', 'password');
    });
    
    await logger.step('Save and verify console logs', async () => {
      // Save console logs to file
      const logFile = await loginPage.saveConsoleLogsToFile();
      logger.info(`Console logs saved to: ${logFile}`);
      
      // Verify no console errors
      const errors = loginPage.getConsoleErrors();
      expect(errors.length).toBe(0);
      
      // Log warnings if any
      const warnings = loginPage.getConsoleWarnings();
      if (warnings.length > 0) {
        logger.warn(`Found ${warnings.length} console warnings`);
      }
    });
    
    // Stop capturing
    loginPage.stopCapturingConsoleLogs();
  });
});
```

### Example 3: Capture Only Errors and Warnings

```typescript
import { Page, TestInfo } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';

export class ErrorMonitoringPage extends BasePage {
  /**
   * Capture only errors and warnings, then save to file
   */
  async captureErrorsAndWarnings(): Promise<void> {
    // Capture only errors and warnings
    await this.captureConsoleLogs(['error', 'warning']);
    
    // Perform test actions
    await this.navigate();
    await this.performActions();
    
    // Save errors to file
    const errorFile = await this.saveConsoleErrorsToFile();
    this.logger.info(`Console errors saved to: ${errorFile}`);
    
    // Verify no errors
    const errors = this.getConsoleErrors();
    if (errors.length > 0) {
      throw new Error(`Found ${errors.length} console errors`);
    }
    
    this.stopCapturingConsoleLogs();
  }
}
```

### Example 4: Complete Test with All Captured Data

```typescript
import { test, expect } from '../../framework/core/BaseTest';
import { SimplePage } from '../pages/simplePage';

test.describe('Simple Test with Monitoring', () => {
  test('google test with console capture', { tag: ['@smoke'] }, async ({logger, page }, testInfo) => {
    const simplePage = new SimplePage(page, undefined, testInfo);
    
    // Start capturing console logs
    await logger.step('Start capturing console logs', async () => {
      await simplePage.startCapturingConsoleLogs();
    });
    
    await logger.step('Open the page', async () => {
      await simplePage.open();
    });
    
    await logger.step('Interact with search', async () => {
      await simplePage.googleClick();
      await simplePage.googleSearch();
    });
    
    // Save all captured data
    await logger.step('Save captured data', async () => {
      const files = await simplePage.saveAllCapturedData();
      logger.info(`Console logs saved to: ${files.consoleLogs}`);
      logger.info(`Console errors saved to: ${files.consoleErrors}`);
    });
  });
});
```

## File Output

### File Location

All console log files are saved in the `log/` folder with the following naming pattern:

- `console-logs_<ClassName>_<timestamp>.txt` - All console logs
- `console-errors_<ClassName>_<timestamp>.txt` - Only console errors

Example: `console-logs_LoginPage_2024-01-01_12-00-00.txt`

### File Contents

Console log files include:

- **Header Information**
  - Generation timestamp
  - Page class name
  - Total logs captured

- **Log Entries**
  - Log type (log, debug, info, warning, error)
  - Log message text
  - Location information (URL, line number, column number)
  - Timestamp for each entry

- **Summary**
  - Count by log type
  - Total logs captured

### Example File Content

```
================================================================================
CONSOLE LOGS CAPTURE REPORT
Generated: 2024-01-01T12:00:00.000Z
Page: LoginPage
Total Logs Captured: 5
================================================================================

[1] ERROR: Uncaught TypeError: Cannot read property 'value' of null
    Location: https://example.com/login:123:45
    Timestamp: 2024-01-01T12:00:00.100Z

[2] WARNING: Deprecated API usage detected
    Location: https://example.com/login:456:78
    Timestamp: 2024-01-01T12:00:01.200Z

================================================================================
SUMMARY BY TYPE
================================================================================
ERROR: 1
WARNING: 1
INFO: 3
```

## Best Practices

### ✅ DO

1. **Start capturing before test actions**
   ```typescript
   await this.captureConsoleLogs();
   await this.navigate(); // Actions after capturing starts
   ```

2. **Save logs after actions complete**
   ```typescript
   await this.performActions();
   await this.saveConsoleLogsToFile();
   ```

3. **Verify no errors in assertions**
   ```typescript
   const errors = this.getConsoleErrors();
   expect(errors.length).toBe(0);
   ```

4. **Stop capturing when done**
   ```typescript
   this.stopCapturingConsoleLogs();
   ```

### ❌ DON'T

1. **Don't forget to stop capturing**
   ```typescript
   // ❌ Bad - memory leak
   await this.captureConsoleLogs();
   // Never stops capturing
   
   // ✅ Good
   await this.captureConsoleLogs();
   // ... actions ...
   this.stopCapturingConsoleLogs();
   ```

2. **Don't capture in beforeEach without cleanup**
   ```typescript
   // ❌ Bad - multiple captures
   test.beforeEach(async () => {
     await page.captureConsoleLogs(); // Called multiple times
   });
   ```

## Summary

Console log capture provides powerful debugging capabilities:

- ✅ **Automatic Capture** - Captures all browser console messages
- ✅ **File Saving** - Automatically saves to `log/` folder
- ✅ **Filtering** - Capture specific log levels
- ✅ **Programmatic Access** - Access data for assertions
- ✅ **Detailed Information** - Includes location and timestamps

For more information, see [BasePage Examples](./basepage-examples.md#pattern-6-capturing-console-logs-and-saving-to-files).

