---
sidebar_position: 1
---

# Playwright Configuration Guide

This guide explains the comprehensive Playwright configuration system in this framework, including environment profiles, browser management, cloud testing integration, and mobile testing capabilities.

## Overview

The `playwright.config.ts` file provides a flexible, environment-driven configuration system that supports:

- **Multiple Environment Profiles** (development, preprod, qable)
- **Cloud Testing Integration** (LambdaTest, BrowserStack)
- **Mobile Device Testing**
- **CI/CD Optimization**
- **Dynamic Browser Selection**

## Environment Profiles

The framework uses a profile-based configuration system that allows you to switch between different environments seamlessly.

### Profile Selection

Profiles can be selected using either:
- `RUN` environment variable (preferred)
- `NODE_ENV` environment variable
- Defaults to `development` if neither is set

```bash
# Using RUN variable (recommended)
RUN=preprod npm test

# Using NODE_ENV
NODE_ENV=preprod npm test

# Default behavior
npm test  # Uses development profile
```

### Available Profiles

#### Development Profile
```typescript
development: {
  baseURL: 'https://qable.io',
  browser: 'chrome',
  headless: false,
  parallel: 1,
  retries: 0,
  screenshotOnFail: true,
  videoOnFail: true,
  elementHighlight: true,
  // ... additional configuration
}
```

**Key Features:**
- Local development environment
- Non-headless mode for debugging
- Single worker for stability
- Visual debugging enabled

#### Preprod Profile
```typescript
preprod: {
  baseURL: 'https://qable.io',
  browser: 'chrome',
  headless: false,
  parallel: 1,
  retries: 0,
  screenshotOnFail: true,
  videoOnFail: true,
  elementHighlight: true,
  reportEmail: {
    email: true,
    to: ['ankitpatel@qable.io'],
    subject: 'Preprod Test Report - Allure Results',
    body: 'Test execution completed for preprod environment. Allure report attached.',
  },
  // ... additional configuration
}
```

**Key Features:**
- Pre-production environment
- Email reporting enabled
- Allure reporting configured
- SMTP configuration included

#### Qable Profile
```typescript
qable: {
  baseURL: 'https://www.qable.io/blog',
  browser: 'chrome',
  headless: false,
  parallel: 1,
  retries: 0,
  screenshotOnFail: true,
  videoOnFail: true,
  elementHighlight: true,
  // ... additional configuration
}
```

**Key Features:**
- External website testing
- Similar configuration to preprod
- Optimized for third-party testing

## Browser Configuration

### Supported Browsers

The framework supports multiple browsers:

- **Chrome/Chromium** - Default browser
- **Firefox** - Cross-browser testing
- **WebKit/Safari** - Apple ecosystem testing
- **Chrome Incognito** - Privacy-focused testing

### Browser Selection

#### Command Line Override
```bash
# Override browser via environment variable
BROWSER=firefox npm test
BROWSER=webkit npm test
BROWSER="chrome incognito" npm test
```

#### Profile Configuration
```typescript
// In profile configuration
browser: 'chrome', // 'chrome'|'chromium'|'firefox'|'webkit'|'chrome incognito'
```

### CI/CD Optimizations

The framework includes extensive CI/CD optimizations:

```typescript
const ciLaunchOptions = {
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--no-zygote',
    '--disable-gpu',
    // ... 50+ additional optimizations
  ],
  timeout: 60000,
  slowMo: process.env.CI ? 100 : 0
};
```

**Benefits:**
- Reduced memory usage
- Faster browser startup
- Better stability in CI environments
- Optimized resource consumption

## Cloud Testing Integration

### LambdaTest Integration

```typescript
lambdatest: {
  user: 'your-username',
  key: 'your-access-key',
  capabilities: {
    'LT:Options': {
      platform: 'Windows 10',
      browserName: 'Chrome',
      browserVersion: 'latest',
      resolution: '1920x1080',
      name: 'Playwright Tests',
      build: 'Test Build',
      projectName: 'Web Framework',
      console: true,
      network: true,
      visual: true,
      video: true,
    }
  }
}
```

### BrowserStack Integration

```typescript
browserstack: {
  user: 'your-username',
  key: 'your-access-key',
  capabilities: {
    'bstack:options': {
      os: 'Windows',
      osVersion: '10',
      browserName: 'chrome',
      browserVersion: 'latest',
      resolution: '1920x1080',
      projectName: 'Web Framework',
      buildName: 'Test Build',
      sessionName: 'Playwright Tests',
      local: false,
      networkLogs: true,
      consoleLogs: 'info',
      video: true,
    }
  }
}
```

### Grid Configuration

Enable cloud testing by setting `isGrid: true` in your profile:

```typescript
grid: {
  isGrid: true,
  provider: 'lambdatest', // or 'browserstack'
  // ... provider configuration
}
```

**WebSocket Endpoints:**
- **LambdaTest**: `wss://cdp.lambdatest.com/playwright?capabilities=...`
- **BrowserStack**: `wss://cdp.browserstack.com/playwright?caps=...`

## Mobile Testing

### Mobile Device Support

The framework supports various mobile devices through Playwright's device descriptors:

```typescript
const MOBILE_DEVICE_ALIASES = {
  'pixel 5': 'Pixel 5',
  'pixel 7': 'Pixel 7',
  'pixel 9': 'Pixel 7', // approximate mapping
  'samsung s9': 'Galaxy S9+',
  'iphone 12': 'iPhone 12',
  'iphone 14 pro': 'iPhone 14 Pro',
  'ipad mini': 'iPad Mini',
};
```

### Mobile Configuration

```typescript
mobile: {
  mobile: { 
    isMobile: true, 
    device: 'pixel 9' 
  },
}
```

**Features:**
- Touch simulation
- Mobile viewport
- Device-specific capabilities
- Responsive testing

## Reporting Configuration

### Allure Reporting

```typescript
report: {
  name: 'allure-playwright',
  outputFolder: 'allure-results',
  suiteTitle: false,
}
```

### Email Reporting

```typescript
reportEmail: {
  email: true,
  to: ['recipient@example.com'],
  subject: 'Test Report - Allure Results',
  body: 'Test execution completed. Allure report attached.',
}
```

### SMTP Configuration

```typescript
reportSmtp: envConfig.getSmtpConfig()
```

## Timeout Configuration

### Global Timeouts

```typescript
// Test timeout
timeout: process.env.CI ? 120000 : 60000, // 2 minutes for CI, 1 minute for local

// Action timeout
actionTimeout: process.env.CI ? 120000 : 90000,

// Navigation timeout
navigationTimeout: process.env.CI ? 180000 : 90000,
```

### Retry Configuration

```typescript
retries: selectedProfile.retries, // Configurable per profile
```

## Parallel Execution

### Worker Configuration

```typescript
workers: selectedProfile.parallel, // Number of parallel workers
fullyParallel: true, // Run tests in files in parallel
```

### CI/CD Optimization

```typescript
// Fail the build on CI if test.only is left in code
forbidOnly: !!process.env.CI,

// Retry on CI only
retries: selectedProfile.retries,
```

## Screenshot and Video Configuration

### Conditional Media Capture

```typescript
// Screenshots
screenshot: (selectedProfile as any).grid?.isGrid ? 'off' : 
           (selectedProfile.screenshotOnFail ? 'only-on-failure' : 'off'),

// Videos
video: (selectedProfile as any).grid?.isGrid ? 'off' : 
      (selectedProfile.videoOnFail ? 'retain-on-failure' : 'off'),
```

**Logic:**
- Disabled on cloud grids (handled by provider)
- Enabled locally based on profile settings
- Captures only on failure for efficiency

## Trace Configuration

```typescript
trace: process.env.CI ? 'retain-on-failure' : 'on-first-retry',
```

**Benefits:**
- Debugging failed tests
- Performance analysis
- Network request inspection

## Usage Examples

### Basic Usage

```bash
# Run with development profile
npm test

# Run with specific profile
RUN=preprod npm test

# Run with specific browser
BROWSER=firefox npm test

# Run in headless mode
HEADLESS=true npm test
```

### Cloud Testing

```bash
# Enable grid mode in profile, then run
RUN=preprod npm test

# The framework will automatically:
# 1. Detect grid configuration
# 2. Connect to cloud provider
# 3. Execute tests remotely
# 4. Collect results
```

### Mobile Testing

```bash
# Configure mobile in profile, then run
RUN=mobile npm test

# Tests will run on mobile device simulation
```

## Best Practices

### 1. Profile Management
- Use descriptive profile names
- Keep environment-specific configurations separate
- Use `RUN` variable for profile selection

### 2. Cloud Testing
- Test locally first
- Use appropriate capabilities for your needs
- Monitor cloud provider usage

### 3. Performance
- Use CI optimizations in CI environments
- Adjust timeouts based on environment
- Use appropriate parallel workers

### 4. Debugging
- Enable element highlighting for local development
- Use trace viewer for failed tests
- Configure appropriate retry strategies

## Troubleshooting

### Common Issues

1. **Browser Launch Failures**
   - Check CI optimization settings
   - Verify timeout configurations
   - Ensure proper permissions

2. **Cloud Connection Issues**
   - Verify credentials
   - Check network connectivity
   - Validate capabilities format

3. **Mobile Testing Issues**
   - Verify device aliases
   - Check mobile configuration
   - Ensure proper viewport settings

### Debug Commands

```bash
# Run with debug mode
npm run test:debug

# Run with UI mode
npm run test:ui

# Run with headed mode
npm run test:headed
```

## Configuration Reference

### Complete Profile Structure

```typescript
interface Profile {
  baseURL: string;
  browser: string;
  headless: boolean;
  parallel: number;
  retries: number;
  screenshotOnFail: boolean;
  videoOnFail: boolean;
  elementHighlight: boolean;
  mobile?: {
    mobile: {
      isMobile: boolean;
      device: string;
    };
  };
  report?: {
    name: string;
    outputFolder: string;
    suiteTitle: boolean;
  };
  reportEmail?: {
    email: boolean;
    to: string[];
    subject: string;
    body: string;
  };
  reportSmtp?: any;
  grid?: {
    isGrid: boolean;
    provider: 'lambdatest' | 'browserstack';
    lambdatest?: any;
    browserstack?: any;
  };
}
```

This configuration system provides maximum flexibility while maintaining simplicity for common use cases. The framework automatically handles complex scenarios like cloud testing, mobile simulation, and CI/CD optimizations based on your profile selection.
