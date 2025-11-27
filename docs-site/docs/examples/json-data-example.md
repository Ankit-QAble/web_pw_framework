---
sidebar_position: 4
---

# JSON Data Example

This guide demonstrates how to use JSON files for test data management in your Playwright test suites.

## Overview

JSON files are ideal for structured, nested test data. The framework provides multiple ways to load and use JSON data with type safety and caching for performance.

## Table of Contents

- [File Structure](#file-structure)
- [Loading JSON Data](#loading-json-data)
- [Complete Examples](#complete-examples)
- [Best Practices](#best-practices)

## File Structure

Place JSON files in `test/data/` directory. Example structure:

**`test/data/users.json`**
```json
{
  "validUsers": [
    {
      "mobileNumber": "90336607",
      "password": "QAble@2020",
      "otp": "333333",
      "firstName": "Admin",
      "lastName": "User",
      "address": {
        "street": "123 Admin Street",
        "city": "New York",
        "country": "USA"
      }
    }
  ],
  "invalidUsers": [
    {
      "username": "invalid@example.com",
      "password": "wrongpassword",
      "expectedError": "Invalid username or password"
    }
  ],
  "orangeHrm": {
    "url": "https://opensource-demo.orangehrmlive.com/web/index.php/auth/login",
    "validUsers": [
      {
        "username": "Admin",
        "password": "admin123"
      }
    ]
  }
}
```

## Loading JSON Data

### Method 1: Using DataHelper.loadJsonData() (Recommended)

```typescript
import { DataHelper } from '../../framework/utils/DataHelper';

// Define TypeScript interface for type safety
interface UserData {
  validUsers: Array<{
    mobileNumber: string;
    password: string;
    otp: string;
    firstName: string;
    lastName: string;
    address: {
      street: string;
      city: string;
      country: string;
    };
  }>;
  invalidUsers: Array<{
    username: string;
    password: string;
    expectedError: string;
  }>;
}

// Load JSON data with type safety
const userData = DataHelper.loadJsonData<UserData>('users.json');

// Access nested properties
const firstUser = userData.validUsers[0];
const mobileNumber = firstUser.mobileNumber;
const street = firstUser.address.street;
```

**Benefits:**
- Type safety with TypeScript interfaces
- Automatic caching for performance
- Runtime loading (can reload if file changes)

### Method 2: Using Direct Import (Static Data)

```typescript
// Direct import - data is loaded at compile time
import userData from '../data/users.json';

// Use in tests
const user = userData.validUsers[0];
await loginPage.login(user.mobileNumber, user.password);
```

**Benefits:**
- Simple syntax
- Compile-time validation
- No runtime file reading

**Limitations:**
- Data is static (cannot reload)
- Requires TypeScript configuration for JSON imports

### Method 3: Using testData Helper

```typescript
import { testData } from '../../framework/utils/DataHelper';

// Quick access to common data structures
const validUsers = testData.validUsers;
const invalidUsers = testData.invalidUsers;
const allUsers = testData.users;

// Use in test
const user = validUsers[0];
await loginPage.login(user.mobileNumber, user.password);
```

**Benefits:**
- Convenient shortcuts
- Pre-configured for common use cases

## Complete Examples

### Example 1: Basic Test with JSON Data

```typescript
import { test, expect } from '../../framework/core/BaseTest';
import { LoginPage } from '../pages/LoginPage';
import { DataHelper } from '../../framework/utils/DataHelper';

test.describe('Login Tests with JSON Data', () => {
  let loginPage: LoginPage;
  
  // Load data once at module level
  const userData = DataHelper.loadJsonData<any>('users.json');

  test.beforeEach(async ({ page }, testInfo) => {
    loginPage = new LoginPage(page, undefined, testInfo);
  });

  test('should login with valid user from JSON', async ({ logger }) => {
    const user = userData.validUsers[0];
    
    await logger.step('Navigate to login page', async () => {
      await loginPage.open();
    });
    
    await logger.step('Login with credentials from JSON', async () => {
      await loginPage.login(user.mobileNumber, user.password);
    });
    
    await logger.step('Verify login successful', async () => {
      // Your verification logic
    });
  });
});
```

### Example 2: Data-Driven Testing with JSON

```typescript
import { test, expect } from '../../framework/core/BaseTest';
import { LoginPage } from '../pages/LoginPage';
import { DataHelper } from '../../framework/utils/DataHelper';

test.describe('Data-Driven Login Tests', () => {
  const userData = DataHelper.loadJsonData<any>('users.json');

  // Test with all valid users
  userData.validUsers.forEach((user: any, index: number) => {
    test(`should login successfully - User ${index + 1} @smoke`, async ({ page, logger }, testInfo) => {
      const loginPage = new LoginPage(page, undefined, testInfo);
      await loginPage.open();
      
      await logger.step(`Login with user: ${user.mobileNumber}`, async () => {
        await loginPage.login(user.mobileNumber, user.password);
      });
    });
  });

  // Test with all invalid users
  userData.invalidUsers.forEach((user: any, index: number) => {
    test(`should fail login - Invalid User ${index + 1} @negative`, async ({ page, logger }, testInfo) => {
      const loginPage = new LoginPage(page, undefined, testInfo);
      await loginPage.open();
      
      await logger.step('Attempt invalid login', async () => {
        await loginPage.login(user.username, user.password);
      });
      
      await logger.step('Verify error message', async () => {
        await loginPage.verifyErrorMessage(user.expectedError);
      });
    });
  });
});
```

### Example 3: Accessing Nested JSON Properties

```typescript
import { DataHelper } from '../../framework/utils/DataHelper';

const userData = DataHelper.loadJsonData<any>('users.json');

// Access nested objects
const orangeHrmUrl = userData.orangeHrm.url;
const orangeHrmUser = userData.orangeHrm.validUsers[0];

// Access nested address
const user = userData.validUsers[0];
const city = user.address.city;
const country = user.address.country;
const street = user.address.street;
```

### Example 4: Using JSON Data in Page Objects

```typescript
import { Page, TestInfo } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';
import { DataHelper } from '../../framework/utils/DataHelper';

export class LoginPage extends BasePage {
  private static userData = DataHelper.loadJsonData<any>('users.json');

  constructor(page: Page, url?: string, testInfo?: TestInfo) {
    super(page, url || 'https://example.com/login', testInfo);
  }

  /**
   * Login with default valid user from JSON
   */
  async loginWithDefaultUser(): Promise<void> {
    const user = LoginPage.userData.validUsers[0];
    await this.login(user.mobileNumber, user.password);
  }

  /**
   * Get valid user by index
   */
  getValidUser(index: number = 0): any {
    return LoginPage.userData.validUsers[index];
  }
}
```

### Example 5: Environment-Specific JSON Data

```typescript
import { DataHelper } from '../../framework/utils/DataHelper';

// Load different data based on environment
const environment = process.env.ENV || 'dev';
const dataFile = `users-${environment}.json`;
const userData = DataHelper.loadJsonData<any>(dataFile);

// Use environment-specific data
const user = userData.validUsers[0];
```

## Best Practices

### ✅ DO

1. **Use TypeScript interfaces for type safety**
   ```typescript
   interface UserData {
     validUsers: User[];
   }
   const userData = DataHelper.loadJsonData<UserData>('users.json');
   ```

2. **Load data at module level for performance**
   ```typescript
   // ✅ Good - loaded once
   const userData = DataHelper.loadJsonData('users.json');
   ```

3. **Organize data logically**
   ```json
   {
     "validUsers": [...],
     "invalidUsers": [...],
     "testConfig": {...}
   }
   ```

4. **Use descriptive property names**
   ```json
   {
     "validUsers": [...],  // ✅ Clear
     "users": [...]        // ❌ Ambiguous
   }
   ```

### ❌ DON'T

1. **Don't load data inside loops**
   ```typescript
   // ❌ Bad - loads file multiple times
   for (let i = 0; i < 10; i++) {
     const data = DataHelper.loadJsonData('users.json');
   }
   ```

2. **Don't forget to handle missing data**
   ```typescript
   // ❌ Bad - may throw error
   const user = userData.validUsers[0];
   
   // ✅ Good - handle missing data
   const user = userData.validUsers[0];
   if (user) {
     await login(user.mobileNumber, user.password);
   }
   ```

## Summary

JSON files provide a flexible way to manage test data:

- ✅ **Structured Data** - Perfect for nested, complex data structures
- ✅ **Type Safety** - Use TypeScript interfaces for compile-time validation
- ✅ **Performance** - Automatic caching for fast access
- ✅ **Flexibility** - Multiple loading methods to suit your needs
- ✅ **Maintainability** - Easy to read and update

For more information, see [Data Sources Guide](../getting-started/DATA_SOURCES.md#json-data-usage).

