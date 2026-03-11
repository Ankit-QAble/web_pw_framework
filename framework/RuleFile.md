# Project Rules & Guidelines

This document outlines the architectural standards and coding conventions for the automation framework.

## 1. Page Object Model (POM) Structure

The project follows a strict Page Object Model structure to separate concerns between locators, logic, and tests.

### Locators
- **Directory**: `test/locators`
- **Rule**: All element selectors must be stored in this directory.
- **Constraint**: Do not hardcode selectors inside Page classes or Spec files. Use the locator classes.
Example:
```typescript
export const BlogPageLocators = {
    searchBox: "//input[@id='search-input']",
    blogPublishedDate: "//span[@id='current-month-year']"
  };
```

### Page Methods
- **Directory**: `test/pages`
- **Rule**: All interaction logic (clicking, typing, verifying) belongs here from 'BasePage' only.
- **Constraint**: Page classes should extend `BasePage` and use locators imported from the `locators` folder.

### Page Constructor & Navigation
- **Rule**: Page class constructor must accept optional `url` and `testInfo`.
- **Default URL**: If `url` is not provided, use `(global as any).selectedProfile?.baseURL` or `process.env.BASE_URL`.
- **Navigation**: Implement `open()` to call `navigate()` and `waitForPageLoad()` from `BasePage`.
- **Assertions & Waits**: Prefer `BasePage` helpers like `waitForVisible`, `expectVisible`, `getTextAndCompare`, `waitUntilElementClickable`.

### Test Specs
- **Directory**: `test/specs`
- **Rule**: This is where the actual tests are defined.
- **Constraint**: Spec files should only contain test flows and assertions. They should call methods from Page objects to perform actions.

## 2. Naming & Coding Conventions

### Method Naming
- **Rule**: Method names must be descriptive and follow `camelCase` (e.g., `loginUser`, `verifyDashboardLoaded`).
- **Clarity**: Names should clearly indicate the action or verification being performed.

### Method Usage
- **Rule**: Ensure methods are called in a logical sequence within spec files.
- **Chaining**: Where appropriate, ensure async/await is used correctly to handle promises.

## 3. Test Data Management

- **Directory**: `test/data`
- **Format**: JSON
- **Rule**: All static test data (credentials, input values, expected results) must be stored in JSON files in this directory. Avoid hardcoding data in tests.

## 4. Framework Core Usage

- **Directory**: `framework/core`
- **Rule**: Maximize the use of the core framework.
- **Guideline**: Most common actions (clicking, typing, waiting, logging) are already implemented in `BasePage` and `BaseTest`. 
- **Constraint**: Always check `framework/core` for existing capabilities before writing custom implementations for standard browser interactions.

## 5. Linting & Code Style

- **Quotes**: Use single quotes for strings. Double quotes are allowed only to avoid escaping when the string contains single quotes (configured via ESLint `avoidEscape: true`).
- **Indentation**: Use 2 spaces for indentation.
- **Semicolons**: Always use semicolons.
- **Prefer Const**: Use `const` for variables that are not reassigned.
- **No Empty Blocks**: Avoid empty `catch` or function blocks; handle or log errors appropriately.
- **Locator Placement**: Keep all selectors in `test/locators` files; do not hardcode selectors in pages or specs.

## 6. AI Agent Generation Rules

- **POM Output**: Generate three files per scenario:
  - Spec in `test/specs/ai/<name>.spec.ts`
  - Page in `test/pages/ai/<Name>Page.ts` (extends `BasePage`)
  - Locators in `test/locators/ai/<Name>Locators.ts` (export a single const)
- **Spec Imports**: Import `test` from `framework/core/BaseTest` using the correct relative path based on spec location. For specs under `test/specs/ai`, use `../../../framework/core/BaseTest`.
- **Page Structure**: Page constructor accepts `(page, url?, testInfo?)`. Provide an `open()` method that calls `navigate()` and `waitForPageLoad()`.
- **Selectors**: Use unique selectors to avoid Playwright strict mode violations. When multiple elements match (e.g., product lists), disambiguate with `.first()` or index.
- **Navigation**: If menu elements are not visible or stable, navigate directly using category paths (e.g., `index.php?rt=product/category&path=<id>`) and wait for `domcontentloaded` then `networkidle`.
- **Assertions & Waits**: Prefer helpers from `BasePage` (`waitForVisible`, `getTextAndCompare`, `waitUntilElementClickable`) and avoid clicking hidden elements.
- **Credentials & URLs**: Do not hardcode credentials. If a login endpoint is inaccessible (e.g., returns Forbidden), skip login and proceed with public flows.
- **No Comments**: Generated code must not include comments.
