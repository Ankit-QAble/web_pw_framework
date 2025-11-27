---
sidebar_position: 9
---

# Running Tests by Group

This guide demonstrates various ways to run tests by groups, tags, or specific test suites in Playwright.

## Table of Contents

- [Running by Test Suite (describe block)](#running-by-test-suite-describe-block)
- [Running by Tags](#running-by-tags)
- [Running by File](#running-by-file)
- [Running Multiple Groups](#running-multiple-groups)
- [Excluding Groups](#excluding-groups)
- [Best Practices](#best-practices)

## Running by Test Suite (describe block)

### Using --grep with Suite Name

You can run tests from a specific `test.describe` block by using the suite name with `--grep`:

```bash
# Run tests from "Simple Test Suite" only
npx playwright test --grep "Simple Test Suite"

# Run tests from "Simple Test Suite Two" only
npx playwright test --grep "Simple Test Suite Two"
```

### Example Test Structure

```typescript
test.describe('Simple Test Suite', () => {
  test('google test', { tag: ['@smoke'] }, async ({logger, page }, testInfo) => {
    // Test code...
  });
});

test.describe('Simple Test Suite Two', () => {
  test('google test two', { tag: ['@smoke', '@regression'] }, async ({logger, page }, testInfo) => {
    // Test code...
  });
});
```

### Run Commands

```bash
# Run only "Simple Test Suite"
npx playwright test --grep "Simple Test Suite"

# Run only "Simple Test Suite Two"
npx playwright test --grep "Simple Test Suite Two"

# Run specific file with suite filter
npx playwright test test/specs/simpletest.spec.ts --grep "Simple Test Suite"
```

## Running by Tags

Tags are the most flexible way to group and run tests. You can tag individual tests or entire suites.

### Tagging Tests

```typescript
// Tag individual test
test('google test', { tag: ['@smoke'] }, async ({logger, page }, testInfo) => {
  // Test code...
});

// Tag entire suite
test.describe('Login Tests @smoke', () => {
  test('should login', async ({logger, page }, testInfo) => {
    // Test code...
  });
});

// Multiple tags
test('comprehensive test', { tag: ['@smoke', '@regression', '@critical'] }, async ({logger, page }, testInfo) => {
  // Test code...
});
```

### Run by Single Tag

```bash
# Run all tests with @smoke tag
npx playwright test --grep "@smoke"

# Run with specific file
npx playwright test test/specs/simpletest.spec.ts --grep "@smoke"

# Run with specific browser
npx playwright test --grep "@smoke" --project=chromium
```

### Run by Multiple Tags (OR - any match)

```bash
# Run tests with @smoke OR @critical tag
npx playwright test --grep "@smoke|@critical"

# PowerShell (Windows)
npx playwright test --grep "@smoke|@critical"

# Multiple tags
npx playwright test --grep "@smoke|@critical|@regression"
```

### Run by Multiple Tags (AND - all must match)

```bash
# Run tests that have BOTH @smoke AND @critical tags
# Note: Playwright doesn't natively support AND, but you can use regex
npx playwright test --grep "(?=.*@smoke)(?=.*@critical)"
```

### Exclude Tags

```bash
# Run all tests EXCEPT those with @slow tag
npx playwright test --grep-invert "@slow"

# Run @smoke tests but exclude @slow
npx playwright test --grep "@smoke" --grep-invert "@slow"
```

## Running by File

### Run Specific Test File

```bash
# Run all tests in a specific file
npx playwright test test/specs/simpletest.spec.ts

# Run with specific browser
npx playwright test test/specs/simpletest.spec.ts --project=chromium
```

### Run Multiple Files

```bash
# Run multiple specific files
npx playwright test test/specs/simpletest.spec.ts test/specs/login.spec.ts

# Run all files in a directory
npx playwright test test/specs/
```

## Running Multiple Groups

### Combine File and Tag

```bash
# Run @smoke tests in specific file
npx playwright test test/specs/simpletest.spec.ts --grep "@smoke"

# Run @smoke tests in multiple files
npx playwright test test/specs/simpletest.spec.ts test/specs/login.spec.ts --grep "@smoke"
```

### Combine Suite and Tag

```bash
# Run tests from "Simple Test Suite" with @smoke tag
npx playwright test --grep "Simple Test Suite" --grep "@smoke"
```

## Excluding Groups

### Exclude Specific Suite

```bash
# Run all tests EXCEPT "Simple Test Suite Two"
npx playwright test --grep-invert "Simple Test Suite Two"
```

### Exclude Specific Tags

```bash
# Run all tests EXCEPT @slow
npx playwright test --grep-invert "@slow"

# Run @smoke tests EXCEPT @slow
npx playwright test --grep "@smoke" --grep-invert "@slow"
```

## Complete Examples

### Example 1: Run All Smoke Tests

```bash
# Run all @smoke tests across all files
npx playwright test --grep "@smoke"

# Run @smoke tests in specific file
npx playwright test test/specs/simpletest.spec.ts --grep "@smoke"
```

### Example 2: Run Specific Test Suite

```bash
# Run only "Simple Test Suite"
npx playwright test test/specs/simpletest.spec.ts --grep "Simple Test Suite"

# Run only "Simple Test Suite Two"
npx playwright test test/specs/simpletest.spec.ts --grep "Simple Test Suite Two"
```

### Example 3: Run Multiple Suites

```bash
# Run tests from multiple suites (OR)
npx playwright test --grep "Simple Test Suite|Login Tests"

# Run tests matching pattern
npx playwright test --grep "Simple.*Suite"
```

### Example 4: Run with Environment Variables

```bash
# Set environment and run specific group
$env:PROJECT="my-project-chromium-staging"
npx playwright test test/specs/simpletest.spec.ts --grep "@smoke" --project=chromium
```

### Example 5: Run in UI Mode

```bash
# Run specific suite in UI mode
npx playwright test --ui --grep "Simple Test Suite"

# Run specific tag in UI mode
npx playwright test --ui --grep "@smoke"
```

## NPM Scripts

You can add custom scripts to `package.json` for common group runs:

```json
{
  "scripts": {
    "test:smoke": "npx playwright test --grep \"@smoke\"",
    "test:critical": "npx playwright test --grep \"@critical\"",
    "test:regression": "npx playwright test --grep \"@regression\"",
    "test:simple": "npx playwright test test/specs/simpletest.spec.ts",
    "test:simple:smoke": "npx playwright test test/specs/simpletest.spec.ts --grep \"@smoke\"",
    "test:simple:suite1": "npx playwright test test/specs/simpletest.spec.ts --grep \"Simple Test Suite\"",
    "test:simple:suite2": "npx playwright test test/specs/simpletest.spec.ts --grep \"Simple Test Suite Two\""
  }
}
```

Then run:
```bash
npm run test:smoke
npm run test:simple:suite1
npm run test:simple:smoke
```

## Best Practices

### ✅ DO

1. **Use descriptive suite names**
   ```typescript
   // ✅ Good
   test.describe('Login Page Tests', () => {});
   test.describe('User Management Tests', () => {});
   
   // ❌ Bad
   test.describe('Tests', () => {});
   test.describe('Suite1', () => {});
   ```

2. **Use consistent tag naming**
   ```typescript
   // ✅ Good - consistent prefix
   { tag: ['@smoke', '@critical', '@regression'] }
   
   // ❌ Bad - inconsistent
   { tag: ['smoke', '@critical', 'regression'] }
   ```

3. **Tag at suite level when appropriate**
   ```typescript
   // ✅ Good - tag entire suite
   test.describe('Login Tests @smoke', () => {
     // All tests inherit the tag
   });
   ```

4. **Use multiple tags for flexibility**
   ```typescript
   // ✅ Good - multiple tags for different groupings
   test('comprehensive test', { tag: ['@smoke', '@critical', '@api'] }, async () => {});
   ```

### ❌ DON'T

1. **Don't nest describe blocks incorrectly**
   ```typescript
   // ❌ Bad - nested incorrectly
   test.describe('Suite 1', () => {
     test('test 1', () => {});
     test.describe('Suite 2', () => { // Wrong nesting
       test('test 2', () => {});
     });
   });
   
   // ✅ Good - separate describe blocks
   test.describe('Suite 1', () => {
     test('test 1', () => {});
   });
   test.describe('Suite 2', () => {
     test('test 2', () => {});
   });
   ```

2. **Don't use tags only in metadata**
   ```typescript
   // ❌ Bad - tag only in metadata (doesn't work with --grep)
   test('Enter valid credentials', { tag: ['@smoke'] }, async () => {});
   
   // ✅ Good - tag in title too
   test('Enter valid credentials @smoke', { tag: ['@smoke'] }, async () => {});
   ```

## Summary

Running tests by group provides flexibility:

- ✅ **By Suite** - Use `--grep "Suite Name"` to run specific describe blocks
- ✅ **By Tags** - Use `--grep "@tag"` to run tagged tests
- ✅ **By File** - Specify file path to run all tests in that file
- ✅ **Combinations** - Combine file, suite, and tag filters
- ✅ **Exclusions** - Use `--grep-invert` to exclude groups

For more information, see [Playwright Test Filtering](https://playwright.dev/docs/test-filtering).

