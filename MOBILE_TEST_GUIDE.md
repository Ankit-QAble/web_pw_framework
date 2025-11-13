# Mobile Device Testing Guide

This guide explains how to run Playwright tests with mobile devices and custom viewport dimensions.

## Quick Start

### Method 1: Using NPM Scripts (Easiest)

```powershell
# Run with Pixel 7 device
npm run test:mobile

# Run with iPhone 12 device
npm run test:mobile:iphone

# Run with custom viewport (375x667)
npm run test:mobile:custom
```

### Method 2: Using Environment Variables

```powershell
# Set device and run
$env:MOBILE_DEVICE="pixel7"; $env:RUN="development"; npm test

# Set device with custom viewport
$env:MOBILE_DEVICE="iphone12"; $env:VIEWPORT_WIDTH="390"; $env:VIEWPORT_HEIGHT="844"; npm test

# Run specific test file
$env:MOBILE_DEVICE="pixel9"; npm test test/specs/login.spec.ts
```

### Method 3: Using the Mobile Test Script (Most Flexible)

```powershell
# Basic usage
npm run test:mobile:script pixel7

# With custom viewport
npm run test:mobile:script pixel7 --width=375 --height=667

# With environment and filter
npm run test:mobile:script iphone12 --env=preprod --grep=@smoke

# Run specific test file
npm run test:mobile:script pixel9 test/specs/login.spec.ts

# Headed mode (see browser)
npm run test:mobile:script pixel7 --headed
```

## Available Mobile Devices

You can use these device names (case-insensitive):

### Google Pixel
- `pixel5` or `pixel 5`
- `pixel7` or `pixel 7`
- `pixel8` or `pixel 8`
- `pixel9` or `pixel 9`

### iPhone
- `iphone11` or `iphone 11`
- `iphone12` or `iphone 12`
- `iphone13` or `iphone 13`
- `iphone14` or `iphone 14`
- `iphone14pro` or `iphone 14 pro`
- `iphonese` or `iphone se`

### Samsung
- `samsung s9` or `samsung galaxy s9`
- `galaxy s9` or `galaxy s9+`

### iPad
- `ipad mini` or `ipadmini`
- `ipad pro` or `ipadpro`

### Galaxy Note
- `galaxy note` or `galaxynote`

## Custom Viewport Dimensions

You can set custom X (width) and Y (height) viewport dimensions:

### Via Environment Variables
```powershell
# Set viewport to 375x667 (iPhone SE size)
$env:MOBILE_DEVICE="iphone12"
$env:VIEWPORT_WIDTH="375"
$env:VIEWPORT_HEIGHT="667"
npm test

# Or in one line (PowerShell)
$env:MOBILE_DEVICE="pixel7"; $env:VIEWPORT_WIDTH="412"; $env:VIEWPORT_HEIGHT="915"; npm test
```

### Via Script
```powershell
# Using the mobile test script
npm run test:mobile:script pixel7 --width=375 --height=667

# Short form
npm run test:mobile:script pixel7 --w=375 --h=667
```

## Common Viewport Sizes

| Device | Width (X) | Height (Y) |
|--------|-----------|------------|
| iPhone SE | 375 | 667 |
| iPhone 12/13 | 390 | 844 |
| iPhone 14 Pro | 393 | 852 |
| Pixel 5 | 393 | 851 |
| Pixel 7 | 412 | 915 |
| Galaxy S9+ | 360 | 740 |
| iPad Mini | 768 | 1024 |

## Examples

### Example 1: Run Login Test on iPhone 12
```powershell
$env:MOBILE_DEVICE="iphone12"
npm test test/specs/login.spec.ts
```

### Example 2: Run Smoke Tests on Pixel 7 with Custom Viewport
```powershell
$env:MOBILE_DEVICE="pixel7"
$env:VIEWPORT_WIDTH="412"
$env:VIEWPORT_HEIGHT="915"
npm test -- --grep="@smoke"
```

### Example 3: Run Tests in Preprod on iPad with Custom Size
```powershell
npm run test:mobile:script ipadmini --env=preprod --width=768 --height=1024
```

### Example 4: Run Specific Test with Headed Mode (See Browser)
```powershell
npm run test:mobile:script pixel7 --headed test/specs/login.spec.ts
```

### Example 5: Combine with MCP
```powershell
# Set mobile device
$env:MOBILE_DEVICE="iphone12"
$env:VIEWPORT_WIDTH="390"
$env:VIEWPORT_HEIGHT="844"

# Run via MCP
npm run test:mcp:smoke
```

## Configuration in playwright.config.ts

You can also configure mobile devices directly in your profile:

```typescript
preprod: {
  // ... other config
  mobile: {
    mobile: {
      isMobile: true,
      device: 'pixel 9',
      viewportWidth: 412,  // Custom X value
      viewportHeight: 915, // Custom Y value
    },
  },
}
```

## Command Line Options

The `run-mobile-test.js` script supports:

| Option | Short Form | Description | Example |
|--------|------------|-------------|---------|
| `--width=WIDTH` | `--w=WIDTH` | Set viewport width | `--width=375` |
| `--height=HEIGHT` | `--h=HEIGHT` | Set viewport height | `--height=667` |
| `--env=ENV` | | Set environment | `--env=preprod` |
| `--grep=PATTERN` | `-g=PATTERN` | Filter tests | `--grep=@smoke` |
| `--headed` | `-h` | Run in headed mode | `--headed` |

## Integration with Other Tools

### With Endform (CI/CD)
```yaml
# In GitHub Actions workflow
- name: Run mobile tests
  run: npx playwright test
  env:
    MOBILE_DEVICE: pixel7
    VIEWPORT_WIDTH: 412
    VIEWPORT_HEIGHT: 915
```

### With MCP
```powershell
# Set mobile config
$env:MOBILE_DEVICE="iphone12"
$env:VIEWPORT_WIDTH="390"
$env:VIEWPORT_HEIGHT="844"

# Then ask AI to run tests
# "Run the login test on mobile"
```

## Troubleshooting

### Device Not Found
If you get an error about device not found:
- Check device name spelling (case-insensitive)
- Try using the alias forms: `pixel7` instead of `pixel 7`
- See available devices in `playwright.config.ts` → `MOBILE_DEVICE_ALIASES`

### Viewport Not Applied
- Ensure `MOBILE_DEVICE` is set if using custom viewport
- Check that both width and height are numeric values
- Viewport is only applied when mobile mode is active

### Tests Still Run on Desktop
- Verify `MOBILE_DEVICE` environment variable is set
- Check console output for "📱 Mobile device overridden" message
- Ensure profile's `mobile.isMobile` is `true` in config

## Quick Reference

```powershell
# Quick commands
npm run test:mobile                    # Pixel 7
npm run test:mobile:iphone              # iPhone 12
npm run test:mobile:custom              # Pixel 7 with 375x667
npm run test:mobile:script pixel9      # Any device
npm run test:mobile:script iphone14 --w=393 --h=852  # Custom size
```

## Next Steps

1. Try running a test: `npm run test:mobile:script pixel7`
2. Experiment with custom viewports
3. Add mobile tests to your CI/CD pipeline
4. Use in combination with MCP for AI-assisted testing

---

For more details:
- [README.md](./README.md) - General framework documentation
- [MCP_TEST_GUIDE.md](./MCP_TEST_GUIDE.md) - MCP integration guide
- [playwright.config.ts](./playwright.config.ts) - Configuration details
