# Accessibility Testing in Playwright Framework

## Introduction

This framework supports automated accessibility (a11y) testing using Playwright and the axe-core engine. Automated a11y tests help you quickly detect many common web accessibility issues before they reach your end users.

This feature uses the `@axe-core/playwright` integration, following best practices from the [official Playwright Accessibility documentation](https://playwright.dev/docs/accessibility-testing).

---

## Setup

The required package (`@axe-core/playwright`) is already included in the project as a development dependency. If you need to install it manually, run:

```bash
npm install --save-dev @axe-core/playwright
```

---

## How to Run Accessibility Tests

Convenient npm script:

```bash
npm run test:accessibility
```

This will run accessible test cases from `test/specs/simpletest.spec.ts` and `test/specs/demo.spec.ts` that include accessibility scans.

You can also run these tests as part of any Playwright test run (including in CI).

---

## Example: Scanning a Whole Page

Here's the recommended pattern for adding accessibility tests (using AxeBuilder):

```typescript
import AxeBuilder from '@axe-core/playwright';
import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('Page should not have detectable accessibility issues', async ({ page }) => {
    await page.goto('https://your-site.com/');
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations).toEqual([]);
  });
});
```

You will find real-world examples in:
- `test/specs/demo.spec.ts` (scans the OrangeHRM login page)
- `test/specs/simpletest.spec.ts` (scans https://google.com)

---

## Scanning a Region or Using Advanced Features

You can constrain a scan to a specific DOM region:

```typescript
const results = await new AxeBuilder({ page })
  .include('#my-section')
  .analyze();
```

You can also filter by WCAG tags or exclude elements with known, accepted violations. See the [Playwright Accessibility Guide](https://playwright.dev/docs/accessibility-testing) for more options.

---

## Customizing/Expanding Accessibility Tests

- Copy the snippet above into new/existing spec files to scan any page
- Use `.withTags()`, `.exclude()`, and other builder features for more granular tests
- Inspect/print `results.violations` to debug accessibility issues
- Combine regular Playwright assertions with accessibility scans for full integration

---

## More Resources

- [Playwright Accessibility Testing Guide](https://playwright.dev/docs/accessibility-testing)
- [axe-core Rule Documentation](https://deque.com/axe/core-documentation/)
- [WCAG Guidelines Overview](https://www.w3.org/WAI/standards-guidelines/wcag/)

---

By integrating accessibility scanning into your CI/testing process, you help ensure your applications are more usable and compliant for everyone.
