---
sidebar_position: 6
---

# Console & Network Monitoring

The framework provides built-in utilities for capturing console logs and network traffic during test execution.

## Console Logs

You can capture browser console logs (log, debug, info, warning, error) to verify application health or debug issues.

```typescript
// Start capturing console logs (defaults to all levels if unspecified)
await this.captureConsoleLogs(['error', 'warning']);

// ... perform test actions ...

// Get all captured errors
const errors = this.getConsoleErrors();
expect(errors.length).toBe(0);

// Save console errors to a file
await this.saveConsoleErrorsToFile('my-test-console-errors.txt');
```

## Network Traffic

Monitor network requests to verify API calls, check for failed resources, or analyze performance.

```typescript
// Start capturing network traffic
await this.captureNetworkRequests();
// or with filters: await this.captureNetworkRequests(/api/, 'POST');

// ... perform test actions ...

// Get summary statistics
const summary = this.getNetworkRequestSummary();
console.log(`Total: ${summary.total}, Failed: ${summary.failed}`);

// Get failed requests
const failedReqs = this.getFailedNetworkRequests();
if (failedReqs.length > 0) {
  console.log(`Failed URL: ${failedReqs[0].url}`);
}

// Save failed requests to a file
await this.saveFailedNetworkRequestsToFile('my-test-network-errors.txt');
```

## Comprehensive Reporting

You can save all captured data (logs, errors, network requests, failures) in a single operation. This is useful for generating artifacts on test failure.

```typescript
// Save ALL captured data
// Returns an object with paths to all generated files
const reportPaths = await this.saveAllCapturedDataToFiles('my-test-report');
console.log(`Full report saved at: ${reportPaths.consoleLogs}`);
```

## Helper Wrappers

If you are implementing these in your Page Object, you can wrap them as follows:

```typescript
/**
 * Start capturing console logs and save to file
 */
async startCapturingConsoleLogs(): Promise<void> {
    await this.captureConsoleLogs();
}

/**
 * Start capturing network requests and save to file
 */
async startCapturingNetworkRequests(): Promise<void> {
    await this.captureNetworkRequests();
}

/**
 * Save all captured data (console logs and network requests) to files
 */
async saveAllCapturedData(): Promise<{
    consoleLogs: string;
    consoleErrors: string;
    networkRequests: string;
    failedRequests: string;
}> {
    return await this.saveAllCapturedDataToFiles();
}
```
