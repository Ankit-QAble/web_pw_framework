# Project Rules & Guidelines

This document outlines the architectural standards and coding conventions for the automation framework.

## 1. Page Object Model (POM) Structure

The project follows a strict Page Object Model structure to separate concerns between locators, logic, and tests.

### Locators
- **Directory**: `test/locators`
- **Rule**: All element selectors must be stored in this directory.
- **Constraint**: Do not hardcode selectors inside Page classes or Spec files. Use the locator classes.

### Page Methods
- **Directory**: `test/pages`
- **Rule**: All interaction logic (clicking, typing, verifying) belongs here.
- **Constraint**: Page classes should extend `BasePage` and use locators imported from the `locators` folder.

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
