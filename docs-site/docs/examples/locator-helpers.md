---
sidebar_position: 3
---

## Locator Helper Methods

The framework extends Playwright's built‑in locator APIs (`page.getByRole`, `page.getByText`, etc.) through convenience methods on `BasePage`.  
These helpers let you use semantic locators while still benefiting from all existing `BasePage` features such as logging, highlighting, waits, and auto‑healing (when you pass arrays).

All helpers return a Playwright `Locator`, so they can be passed anywhere a `SelectorDefinition` is accepted (e.g. `click`, `fill`, `waitForVisible`, etc.).

### Available Helper Methods

- **`byRole(role, options?)`** – wraps `page.getByRole(...)`
  - Example: click a button by accessible role and name

  ```typescript
  await this.click(this.byRole('button', { name: 'Login' }));
  ```

- **`byText(text, options?)`** – wraps `page.getByText(...)`

  ```typescript
  await this.click(this.byText('Register'));
  await this.waitForVisible(this.byText(/OTP Verification/i));
  ```

- **`byLabel(text, options?)`** – wraps `page.getByLabel(...)`

  ```typescript
  await this.fill(this.byLabel('Username'), 'admin');
  await this.fill(this.byLabel(/Password/i), 'P@ssw0rd');
  ```

- **`byPlaceholder(text, options?)`** – wraps `page.getByPlaceholder(...)`

  ```typescript
  await this.fill(this.byPlaceholder('Enter Full Name'), 'QA Automation');
  ```

- **`byAltText(text, options?)`** – wraps `page.getByAltText(...)`

  ```typescript
  await this.expectVisible(this.byAltText('Company Branding'));
  ```

- **`byTitle(text, options?)`** – wraps `page.getByTitle(...)`

  ```typescript
  await this.click(this.byTitle('Open user menu'));
  ```

- **`byTestId(testId, options?)`** – wraps `page.getByTestId(...)`

  ```typescript
  await this.click(this.byTestId('login-submit'));
  await this.expectVisible(this.byTestId('dashboard-header'));
  ```

- **`locator(selector, options?)`** – generic wrapper for `page.locator(...)`

  ```typescript
  // CSS selector
  await this.click(this.locator('button[type="submit"]'));

  // Data‑attribute selector
  await this.fill(this.locator('[data-testid="email-input"]'), 'user@example.com');
  ```

- **`locatorXPath(xpathExpression, options?)`** – convenience for XPath locators

  ```typescript
  await this.click(
    this.locatorXPath("//button[normalize-space()='Create Account']")
  );
  ```

### Using Helpers Inside a Page Object

You can freely mix string selectors, arrays (auto‑healing), and the new helpers in the same page object:

```typescript
import { Page, TestInfo } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';

export class LoginPage extends BasePage {
  constructor(page: Page, url?: string, testInfo?: TestInfo) {
    super(page, url || 'https://example.com/login', testInfo);
  }

  async open(): Promise<void> {
    await this.navigate();
    await this.waitForPageLoad();
    await this.expectVisible(this.byRole('heading', { name: 'Login' }));
  }

  async login(username: string, password: string): Promise<void> {
    await this.fill(this.byLabel('Username'), username);
    await this.fill(this.byLabel('Password'), password);
    await this.click(this.byRole('button', { name: 'Login' }));
    await this.waitForNavigation();
  }
}
```

### Mixing Auto‑Healing and Helper Locators

You can still use the auto‑healing behavior by passing arrays that mix helpers and raw selectors:

```typescript
private readonly createAccountButton = [
  this.byRole('button', { name: 'Create Account' }),
  this.locator('[data-testid="create-account"]'),
  this.locatorXPath("//button[normalize-space()='Create Account']")
];

async clickCreateAccount(): Promise<void> {
  await this.click(this.createAccountButton);
}
```

`BasePage` will try each candidate in order until a working locator is found, while still giving you all the benefits of semantic selectors (`byRole`, `byText`, etc.).


