# Jenkins Troubleshooting Guide

This guide helps resolve common Jenkins issues with Playwright tests, specifically the "Target page, context or browser has been closed" error.

## Quick Fixes

### 1. Run Diagnostic Script
First, run the diagnostic script to identify issues:
```bash
npm run diagnose:jenkins
```

### 2. Common Solutions

#### Browser Installation Issues
```bash
# Reinstall browsers with dependencies
npx playwright install --with-deps chromium

# Or install all browsers
npx playwright install --with-deps
```

#### Memory Issues
```bash
# Increase memory limits in Jenkins
export NODE_OPTIONS="--max-old-space-size=4096"
```

#### Permission Issues
```bash
# Fix Jenkins cache permissions
sudo chown -R jenkins:jenkins /var/lib/jenkins/.cache/
sudo chmod -R 755 /var/lib/jenkins/.cache/
```

## Configuration Changes Made

### 1. Playwright Configuration (`playwright.config.ts`)
- ✅ Added CI-specific browser launch options
- ✅ Increased timeouts for CI environments
- ✅ Added memory optimization flags
- ✅ Improved retry logic for flaky CI environments
- ✅ Enhanced browser stability options

### 2. Test Implementation
- ✅ Added browser closure checks
- ✅ Improved error handling with screenshots
- ✅ Added CI-specific timeouts
- ✅ Enhanced navigation stability

### 3. Jenkins-Specific Files
- ✅ `Jenkinsfile` - Complete CI/CD pipeline
- ✅ `jenkins.config.ts` - Jenkins optimizations
- ✅ `scripts/diagnose-jenkins.js` - Environment diagnostics

## Jenkins Pipeline Setup

### Prerequisites
1. Install Node.js 18+ in Jenkins
2. Install Playwright browsers with dependencies
3. Set up proper permissions for Jenkins cache directory

### Pipeline Configuration
Use the provided `Jenkinsfile` which includes:
- Automatic Node.js setup
- Browser installation with dependencies
- Optimized test execution
- Report generation and archiving
- Failure notifications

## Environment Variables

Set these in Jenkins:
```bash
CI=true
JENKINS=true
NODE_OPTIONS=--max-old-space-size=4096
PLAYWRIGHT_BROWSERS_PATH=/var/lib/jenkins/.cache/ms-playwright
```

## Browser Launch Arguments

The configuration now includes these Jenkins-optimized arguments:
```javascript
[
  '--no-sandbox',
  '--disable-setuid-sandbox',
  '--disable-dev-shm-usage',
  '--disable-accelerated-2d-canvas',
  '--no-first-run',
  '--no-zygote',
  '--disable-gpu',
  '--disable-background-timer-throttling',
  '--disable-backgrounding-occluded-windows',
  '--disable-renderer-backgrounding',
  '--disable-features=TranslateUI',
  '--disable-ipc-flooding-protection',
  '--memory-pressure-off',
  '--max_old_space_size=4096',
  '--disable-web-security',
  '--disable-features=VizDisplayCompositor'
]
```

## Test Execution Commands

### For Jenkins
```bash
# Run with CI optimizations
CI=true npx playwright test --reporter=html,allure-playwright

# Run specific test suite
CI=true npx playwright test test/specs/login.spec.ts

# Run with debug info
CI=true DEBUG=pw:api npx playwright test
```

### For Local Development
```bash
# Normal execution
npm test

# With specific environment
npm run test:dev
npm run test:preprod
```

## Monitoring and Debugging

### 1. Check Jenkins Logs
Look for these indicators of issues:
- Memory allocation failures
- Browser launch timeouts
- Permission denied errors
- Network connectivity issues

### 2. Use Diagnostic Script
The diagnostic script checks:
- Environment variables
- System resources (memory, disk)
- Node.js and npm versions
- Playwright installation
- Browser installations
- File permissions
- Cache directory accessibility

### 3. Enable Debug Logging
```bash
# Enable Playwright debug logs
DEBUG=pw:api npx playwright test

# Enable browser logs
npx playwright test --debug
```

## Common Error Solutions

### "Target page, context or browser has been closed"
**Causes:**
- Memory constraints
- Browser process killed by system
- Network timeouts
- Permission issues

**Solutions:**
1. Increase memory limits
2. Use provided CI-optimized browser arguments
3. Check Jenkins agent resources
4. Verify browser installation

### "Browser executable not found"
**Solutions:**
1. Run `npx playwright install --with-deps chromium`
2. Check PLAYWRIGHT_BROWSERS_PATH environment variable
3. Verify Jenkins user permissions

### "Permission denied"
**Solutions:**
1. Fix Jenkins cache directory permissions
2. Ensure Jenkins user owns browser cache
3. Check file system permissions

### "Timeout errors"
**Solutions:**
1. Increase action and navigation timeouts (already configured)
2. Check network connectivity
3. Verify target application is accessible
4. Review Jenkins agent performance

## Performance Optimization

### Resource Allocation
- **Memory**: Minimum 4GB RAM for Jenkins agent
- **CPU**: Minimum 2 cores
- **Disk**: At least 10GB free space for browser cache

### Parallel Execution
- Limit to 2 workers in CI environments
- Use retry logic for flaky tests
- Implement proper test isolation

## Reporting

### HTML Report
- Automatically generated in `playwright-report/`
- Archived by Jenkins pipeline
- Accessible via Jenkins build artifacts

### Allure Report
- Generated in `allure-results/`
- Integrated with Jenkins Allure plugin
- Provides detailed test analytics

## Support

If issues persist after following this guide:

1. Run the diagnostic script and share output
2. Check Jenkins agent system resources
3. Review Jenkins logs for specific error messages
4. Verify network connectivity to target application
5. Consider Jenkins agent upgrade or resource increase

## Additional Resources

- [Playwright CI Documentation](https://playwright.dev/docs/ci)
- [Jenkins Pipeline Documentation](https://www.jenkins.io/doc/book/pipeline/)
- [Allure Reporting](https://docs.qameta.io/allure/)
