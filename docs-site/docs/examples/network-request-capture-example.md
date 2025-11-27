---
sidebar_position: 8
---

# Network Request Capture Example

This guide demonstrates how to capture network requests and responses and save them to files for debugging and API testing.

## Overview

The framework provides built-in capabilities to capture all network requests and responses, including headers, bodies, status codes, and durations. All captured data is automatically saved to text files in the `log/` folder for analysis.

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

export class ApiTestPage extends BasePage {
  async testWithNetworkCapture(): Promise<void> {
    // Start capturing network requests
    await this.captureNetworkRequests();
    
    // Perform test actions that trigger API calls
    await this.navigate();
    await this.submitForm();
    
    // Save network requests to file
    const requestsFile = await this.saveNetworkRequestsToFile();
    this.logger.info(`Network requests saved to: ${requestsFile}`);
    
    // Stop capturing
    this.stopCapturingNetworkRequests();
  }
}
```

## Basic Usage

### Start Capturing Network Requests

```typescript
// Capture all network requests
await this.captureNetworkRequests();

// Capture only requests matching URL pattern
await this.captureNetworkRequests(/\/api\/users/);

// Capture only specific HTTP method
await this.captureNetworkRequests(undefined, 'POST');

// Capture requests matching pattern and method
await this.captureNetworkRequests(/\/api\/login/, 'POST');
```

### Save Network Requests to File

```typescript
// Save all network requests
const requestsFile = await this.saveNetworkRequestsToFile();

// Save only failed requests
const failedFile = await this.saveFailedNetworkRequestsToFile();

// Custom file name
const customFile = await this.saveNetworkRequestsToFile('my-network-logs.txt');
```

### Access Captured Data Programmatically

```typescript
// Get all network requests
const requests = this.getNetworkRequests();

// Get failed requests (status >= 400)
const failed = this.getFailedNetworkRequests();

// Get successful requests (status 200-299)
const successful = this.getSuccessfulNetworkRequests();

// Filter by status code
const errorRequests = this.getNetworkRequests(500);

// Filter by method
const postRequests = this.getNetworkRequests(undefined, 'POST');

// Filter by URL pattern
const apiRequests = this.getNetworkRequestsByUrl(/\/api\/users/);

// Get summary statistics
const summary = this.getNetworkRequestSummary();
```

## Complete Examples

### Example 1: Basic Network Request Capture

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
}
```

### Example 2: Test with Network Request Verification

```typescript
import { test, expect } from '../../framework/core/BaseTest';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login Tests with Network Monitoring', () => {
  test('should login and verify API calls', async ({ page, logger }, testInfo) => {
    const loginPage = new LoginPage(page, undefined, testInfo);
    
    // Start capturing network requests
    await loginPage.captureNetworkRequests();
    
    await logger.step('Navigate to login page', async () => {
      await loginPage.open();
    });
    
    await logger.step('Perform login', async () => {
      await loginPage.login('username', 'password');
    });
    
    await logger.step('Save and verify network requests', async () => {
      // Save network requests to file
      const requestsFile = await loginPage.saveNetworkRequestsToFile();
      logger.info(`Network requests saved to: ${requestsFile}`);
      
      // Verify no failed requests
      const failedRequests = loginPage.getFailedNetworkRequests();
      expect(failedRequests.length).toBe(0);
      
      // Verify login API was called successfully
      const loginRequests = loginPage.getNetworkRequestsByUrl(/\/api\/login/);
      expect(loginRequests.length).toBeGreaterThan(0);
      expect(loginRequests[0].status).toBe(200);
      
      // Get network summary
      const summary = loginPage.getNetworkRequestSummary();
      logger.info(`Total requests: ${summary.total}, Successful: ${summary.successful}`);
    });
    
    // Stop capturing
    loginPage.stopCapturingNetworkRequests();
  });
});
```

### Example 3: Monitor Specific API Endpoint

```typescript
import { Page, TestInfo } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';

export class ApiMonitoringPage extends BasePage {
  /**
   * Monitor specific API endpoint and save to file
   */
  async monitorSpecificApi(endpointPattern: string): Promise<void> {
    // Capture only requests matching the pattern
    await this.captureNetworkRequests(endpointPattern);
    
    // Perform actions that trigger the API
    await this.triggerApiCall();
    
    // Wait for network activity
    await this.waitForPageLoad();
    
    // Save captured requests to file
    const apiFile = await this.saveNetworkRequestsToFile();
    this.logger.info(`API requests saved to: ${apiFile}`);
    
    // Verify API was called
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
}
```

### Example 4: Monitor POST Requests Only

```typescript
import { Page, TestInfo } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';

export class FormSubmissionPage extends BasePage {
  /**
   * Monitor POST requests only and save to file
   */
  async monitorPostRequests(): Promise<void> {
    // Capture only POST requests
    await this.captureNetworkRequests(undefined, 'POST');
    
    // Submit form
    await this.submitForm();
    
    // Wait for network activity
    await this.waitForPageLoad();
    
    // Save POST requests to file
    const postFile = await this.saveNetworkRequestsToFile();
    this.logger.info(`POST requests saved to: ${postFile}`);
    
    // Verify POST request was made
    const postRequests = this.getNetworkRequests(undefined, 'POST');
    expect(postRequests.length).toBeGreaterThan(0);
    
    // Verify POST request was successful
    const postRequest = postRequests[0];
    expect(postRequest.status).toBeGreaterThanOrEqual(200);
    expect(postRequest.status).toBeLessThan(300);
    
    this.stopCapturingNetworkRequests();
  }
}
```

### Example 5: Complete Test with All Captured Data

```typescript
import { test, expect } from '../../framework/core/BaseTest';
import { SimplePage } from '../pages/simplePage';

test.describe('Simple Test with Network Monitoring', () => {
  test('google test with network capture', { tag: ['@smoke'] }, async ({logger, page }, testInfo) => {
    const simplePage = new SimplePage(page, undefined, testInfo);
    
    // Start capturing network requests
    await logger.step('Start capturing network requests', async () => {
      await simplePage.startCapturingNetworkRequests();
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
      logger.info(`Network requests saved to: ${files.networkRequests}`);
      logger.info(`Failed network requests saved to: ${files.failedRequests}`);
    });
  });
});
```

## File Output

### File Location

All network request files are saved in the `log/` folder with the following naming pattern:

- `network-requests_<ClassName>_<timestamp>.txt` - All network requests
- `network-errors_<ClassName>_<timestamp>.txt` - Only failed requests (status >= 400)

Example: `network-requests_LoginPage_2024-01-01_12-00-00.txt`

### File Contents

Network request files include:

- **Header Information**
  - Generation timestamp
  - Page class name
  - Total requests captured

- **Request Details**
  - HTTP method (GET, POST, PUT, DELETE, etc.)
  - Request URL
  - Request headers
  - Request body (JSON parsed when possible)
  - Response status code and status text
  - Response headers
  - Response body (JSON parsed when possible)
  - Request duration in milliseconds
  - Resource type (document, script, xhr, etc.)
  - Timestamp

- **Summary Statistics**
  - Total requests
  - Successful requests (200-299)
  - Failed requests (>= 400)
  - Pending requests
  - Average duration
  - Methods breakdown

### Example File Content

```
================================================================================
NETWORK REQUESTS CAPTURE REPORT
Generated: 2024-01-01T12:00:00.000Z
Page: LoginPage
Total Requests Captured: 15
================================================================================

[1] ✅ POST https://example.com/api/login
    Status: 200 OK
    Duration: 245ms
    Resource Type: xhr
    Timestamp: 2024-01-01T12:00:00.100Z
    Request Headers:
      content-type: application/json
      authorization: Bearer token123
    Request Body: {
      "username": "admin",
      "password": "password123"
    }
    Response Headers:
      content-type: application/json
    Response Body: {
      "token": "abc123",
      "user": {...}
    }

[2] ❌ GET https://example.com/api/users/999
    Status: 404 Not Found
    Duration: 120ms
    Resource Type: xhr
    Timestamp: 2024-01-01T12:00:01.200Z

================================================================================
NETWORK SUMMARY
================================================================================
Total Requests: 15
✅ Successful: 12
❌ Failed: 2
⏳ Pending: 1
⏱️  Average Duration: 180ms

Methods Breakdown:
  GET: 8
  POST: 5
  PUT: 2
```

## Best Practices

### ✅ DO

1. **Start capturing before test actions**
   ```typescript
   await this.captureNetworkRequests();
   await this.navigate(); // Actions after capturing starts
   ```

2. **Wait for network activity to complete**
   ```typescript
   await this.submitForm();
   await this.waitForPageLoad(); // Wait for requests to complete
   await this.saveNetworkRequestsToFile();
   ```

3. **Filter requests when possible**
   ```typescript
   // ✅ Good - only capture relevant requests
   await this.captureNetworkRequests(/\/api\/users/);
   
   // ❌ Bad - captures everything (may be slow)
   await this.captureNetworkRequests();
   ```

4. **Verify API calls in assertions**
   ```typescript
   const apiRequests = this.getNetworkRequestsByUrl(/\/api\/login/);
   expect(apiRequests.length).toBeGreaterThan(0);
   expect(apiRequests[0].status).toBe(200);
   ```

5. **Stop capturing when done**
   ```typescript
   this.stopCapturingNetworkRequests();
   ```

### ❌ DON'T

1. **Don't forget to stop capturing**
   ```typescript
   // ❌ Bad - memory leak
   await this.captureNetworkRequests();
   // Never stops capturing
   ```

2. **Don't capture in beforeEach without cleanup**
   ```typescript
   // ❌ Bad - multiple captures
   test.beforeEach(async () => {
     await page.captureNetworkRequests(); // Called multiple times
   });
   ```

3. **Don't save before requests complete**
   ```typescript
   // ❌ Bad - may miss requests
   await this.submitForm();
   await this.saveNetworkRequestsToFile(); // Too early
   
   // ✅ Good - wait for completion
   await this.submitForm();
   await this.waitForPageLoad();
   await this.saveNetworkRequestsToFile();
   ```

## Summary

Network request capture provides powerful API testing capabilities:

- ✅ **Complete Capture** - Captures requests, responses, headers, and bodies
- ✅ **File Saving** - Automatically saves to `log/` folder
- ✅ **Filtering** - Capture specific URLs or HTTP methods
- ✅ **Programmatic Access** - Access data for assertions
- ✅ **Detailed Information** - Includes durations, status codes, and summaries

For more information, see [BasePage Examples](./basepage-examples.md#pattern-7-capturing-network-requests-and-saving-to-files).

