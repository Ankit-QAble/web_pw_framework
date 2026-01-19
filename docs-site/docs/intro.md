---
sidebar_position: 1
---

# Playwright TypeScript Web Automation Framework

A comprehensive web automation framework built with Playwright and TypeScript, featuring page object model, robust locator management, Allure reporting, and cloud testing with Azure Playwright Testing (20-50 parallel workers).

## ⚡ What's New

- ✅ **Azure Playwright Service** - Fully configured and tested! Run with 5-50 parallel workers
- ✅ **Modern Azure SDK** - Using `@azure/playwright` with `createAzurePlaywrightConfig()`
- ✅ **Production Ready** - 100% test success rate with Azure cloud execution
- ✅ **Azure Pipelines CI/CD** - Complete pipeline configuration for automated testing
- ✅ **GitHub Actions CI/CD** - 6 comprehensive workflows for automated testing
- ✅ **Test Data Management** - Complete guide for using JSON data files
- ✅ **Enhanced Documentation** - Step-by-step guides for all features

## 🚀 Features

- **Playwright Integration**: Latest Playwright with TypeScript support
- **Page Object Model**: Structured and maintainable page objects
- **Locator Management**: Centralized locator management system
- **Base Classes**: Reusable base classes for pages and tests
- **Test Data Management**: JSON-based test data with random data generation
- **Allure Reporting**: Beautiful test reports with screenshots and videos
- **Multi-Browser Support**: Chrome, Firefox, Safari, and mobile browsers
- **Cloud Testing**: Integrated support for BrowserStack, LambdaTest, and Azure Playwright Testing
- **Tag-Based Test Filtering**: Run tests by tags (@smoke, @critical, etc.)
- **Environment Configuration**: Support for multiple test environments
- **Screenshot Management**: Automatic screenshots on failure and custom captures
- **Logging System**: Comprehensive logging with different levels
- **CI/CD Integration**: Ready-to-use pipelines for GitHub Actions and Azure Pipelines
- **Code Quality**: ESLint and Prettier configuration

## 📁 Project Structure

```
web_pw_framework/
├── .github/
│   └── workflows/               # GitHub Actions workflows
│       ├── playwright-tests.yml         # Main CI pipeline
│       ├── lambdatest-tests.yml        # LambdaTest cloud tests
│       ├── browserstack-tests.yml      # BrowserStack cloud tests
│       ├── azure-playwright-tests.yml  # Azure cloud tests
│       ├── nightly-regression.yml      # Nightly regression
│       └── manual-test-run.yml         # Manual test execution
├── framework/
│   ├── core/
│   │   ├── BasePage.ts          # Base page class with common methods
│   │   ├── BaseTest.ts          # Base test class with fixtures
│   │   └── WebDriverWrapper.ts  # Browser management wrapper
│   └── utils/
│       ├── Logger.ts            # Logging utility
│       ├── ScreenshotHelper.ts  # Screenshot management
│       ├── EnvConfig.ts         # Environment configuration
│       ├── EmailService.ts      # Email reporting
│       ├── globalSetup.ts       # Global test setup
│       └── globalTeardown.ts    # Global test teardown
├── test/
│   ├── pages/                   # Page Object Model classes
│   ├── locators/                # Centralized locators
│   ├── specs/                   # Test specifications
│   └── data/                    # Test data files
├── docs/                        # Documentation
├── scripts/                     # Utility scripts
└── allure-results/              # Allure test results
```

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd web_pw_framework
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Install browsers**
   ```bash
   npm run install:browsers
   ```

4. **Run tests locally**
   ```bash
   npm test
   ```

5. **View test reports**
   ```bash
   npm run report
   ```

## 📚 Documentation

Explore our comprehensive documentation:

- **[Getting Started](./getting-started/)** - Quick setup and basic usage
- **[Framework Cheatsheet](./getting-started/FRAMEWORK_CHEATSHEET.md)** - Code snippets for common tasks
- **[Console & Network Monitoring](./getting-started/CONSOLE_NETWORK_MONITORING.md)** - Guide for capturing logs and network traffic
- **[Docker Setup](./getting-started/DOCKER_SETUP.md)** - Run tests in Docker containers
- **[Azure Playwright Testing](./azure/)** - Cloud testing with Azure
- **[BrowserStack Integration](./browserstack/)** - Cross-browser testing
- **[GitHub Actions](./github-actions/)** - CI/CD workflows
- **[Grid Setup](./grid/)** - Selenium Grid configuration
- **[Troubleshooting](./troubleshooting/)** - Common issues and solutions
- **[Examples](./examples/)** - Code examples and best practices
- **[User Guide](./getting-started/USER_GUIDE.md)** - Rules, naming, and workflows for contributors
- **[Data Sources](./getting-started/DATA_SOURCES.md)** - Loading JSON/CSV/Excel fixtures with DataHelper

## 🛠️ Available Scripts

- `npm test` - Run all tests
- `npm run test:headed` - Run tests with browser UI
- `npm run test:debug` - Debug tests
- `npm run test:azure` - Run tests on Azure Playwright Testing
- `npm run test:browserstack` - Run tests on BrowserStack
- `npm run report` - Generate and serve Allure reports

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests to ensure everything works
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.