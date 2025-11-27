---
id: data-sources
title: Working with JSON, CSV, and Excel data
sidebar_position: 40
description: Comprehensive guide on using DataHelper to load test fixtures from JSON, CSV, and Excel files with practical examples.
---

The `framework/utils/DataHelper.ts` utility centralizes every test data lookup. It supports three formats out of the box:

- **JSON** (`*.json`) – parsed into plain objects (cached for performance)
- **CSV** (`*.csv`) – parsed and returned as arrays of objects
- **Excel** (`*.xls`, `*.xlsx`) – parsed with `xlsx` and returned as arrays of rows

All data files should be placed in the `test/data/` directory.

## Table of Contents

- [Quick Start](#quick-start)
- [JSON Data Usage](#json-data-usage)
- [CSV Data Usage](#csv-data-usage)
- [Excel Data Usage](#excel-data-usage)
- [Advanced Patterns](#advanced-patterns)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Quick Start

### Auto-detect by extension
```typescript
import { DataHelper } from '../../framework/utils/DataHelper';

// Auto-detects format by file extension
const books = DataHelper.loadData('Books.csv');        // returns array of rows
const users = DataHelper.loadData('users.json');       // returns JSON object
const creds = DataHelper.loadData('creds.xlsx');       // first sheet by default
```

### Explicit loaders
```typescript
// JSON - Type-safe loading
const jsonData = DataHelper.loadJsonData<{validUsers: any[]}>('users.json');

// CSV - With parsing options
const csvRows = DataHelper.loadCsvData('Books.csv', {
  columns: true,
  skip_empty_lines: true
});

// Excel - With specific sheet name
const excelSheet = DataHelper.loadExcelData('creds.xlsx', 'Test Cases');
```

### Cache control
```typescript
// Clear cache when files change during test execution
DataHelper.clearCache(); // useful inside beforeEach/afterEach
```

## JSON Data Usage

### File Structure

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

### Loading JSON Data

#### Method 1: Using DataHelper.loadJsonData()

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

#### Method 2: Using Direct Import (Static Data)

```typescript
// Direct import - data is loaded at compile time
import userData from '../data/users.json';

// Use in tests
const user = userData.validUsers[0];
await loginPage.login(user.mobileNumber, user.password);
```

#### Method 3: Using testData Helper

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

### Complete JSON Example in Test

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

  // Data-driven test - test with all valid users
  userData.validUsers.forEach((user: any, index: number) => {
    test(`should login successfully - User ${index + 1} @smoke`, async ({ page, logger }, testInfo) => {
      const loginPage = new LoginPage(page, undefined, testInfo);
      await loginPage.open();
      
      await logger.step(`Login with user: ${user.mobileNumber}`, async () => {
        await loginPage.login(user.mobileNumber, user.password);
      });
    });
  });
});
```

### Accessing Nested JSON Properties

```typescript
const userData = DataHelper.loadJsonData<any>('users.json');

// Access nested objects
const orangeHrmUrl = userData.orangeHrm.url;
const orangeHrmUser = userData.orangeHrm.validUsers[0];

// Access nested address
const user = userData.validUsers[0];
const city = user.address.city;
const country = user.address.country;
```

## CSV Data Usage

### File Structure

Place CSV files in `test/data/` directory. The first row should contain headers.

**`test/data/Books.csv`**
```csv
TestBooks,NewBooks
transno_021111762991000,refno_121111762991000
transno_021111762991001,refno_121111762991001
```

**`test/data/products.csv`**
```csv
ProductID,ProductName,Price,Category
PROD001,Laptop,999.99,Electronics
PROD002,Mouse,29.99,Electronics
PROD003,Desk,199.99,Furniture
```

### Loading CSV Data

#### Basic CSV Loading

```typescript
import { DataHelper } from '../../framework/utils/DataHelper';

// Define TypeScript interface matching CSV headers
interface BookCsvRow {
  TestBooks: string;
  NewBooks: string;
}

// Load CSV data - headers become object keys
const books = DataHelper.loadCsvData<BookCsvRow[]>('Books.csv');
const firstBook = books[0]?.TestBooks;
const secondBook = books[0]?.NewBooks;
```

#### CSV with Custom Options

```typescript
interface ProductRow {
  ProductID: string;
  ProductName: string;
  Price: string;
  Category: string;
}

// Load with custom parsing options
const products = DataHelper.loadCsvData<ProductRow[]>('products.csv', {
  columns: true,              // Use first row as headers
  skip_empty_lines: true,     // Skip empty lines
  delimiter: ','              // Custom delimiter (default is comma)
});

// Use in test
const laptop = products.find(p => p.ProductName === 'Laptop');
await productPage.searchProduct(laptop?.ProductID);
```

#### CSV with Column Mapping

```typescript
// Map CSV columns to different property names
const products = DataHelper.loadCsvData('products.csv', {
  columns: {
    'ProductID': 'id',
    'ProductName': 'name',
    'Price': 'price',
    'Category': 'category'
  },
  skip_empty_lines: true
});

// Now access with mapped names
const product = products[0];
console.log(product.id);      // Was ProductID
console.log(product.name);     // Was ProductName
```

### Complete CSV Example in Test

```typescript
import { test, expect } from '../../framework/core/BaseTest';
import { ProductPage } from '../pages/ProductPage';
import { DataHelper } from '../../framework/utils/DataHelper';

test.describe('Product Tests with CSV Data', () => {
  interface ProductRow {
    ProductID: string;
    ProductName: string;
    Price: string;
    Category: string;
  }

  const products = DataHelper.loadCsvData<ProductRow[]>('products.csv');

  test('should search for products from CSV', async ({ page, logger }, testInfo) => {
    const productPage = new ProductPage(page, undefined, testInfo);
    
    // Test with each product from CSV
    for (const product of products) {
      await logger.step(`Search for ${product.ProductName}`, async () => {
        await productPage.open();
        await productPage.searchProduct(product.ProductID);
        await productPage.verifyProductName(product.ProductName);
      });
    }
  });

  // Data-driven test with CSV
  products.forEach((product, index) => {
    test(`should display product ${index + 1}: ${product.ProductName}`, async ({ page, logger }, testInfo) => {
      const productPage = new ProductPage(page, undefined, testInfo);
      await productPage.open();
      await productPage.searchProduct(product.ProductID);
      await productPage.verifyProductDetails(product);
    });
  });
});
```

## Excel Data Usage

### File Structure

Place Excel files (`.xlsx` or `.xls`) in `test/data/` directory. Excel files can contain multiple sheets.

**Example Excel Structure (`creds.xlsx`):**

| Sheet: "Test Cases" |        |        |
|---------------------|--------|--------|
| UserName            | Password | Role   |
| Admin               | admin123 | Admin  |
| User1               | password1| User   |
| User2               | password2| User   |

### Loading Excel Data

#### Basic Excel Loading

```typescript
import { DataHelper } from '../../framework/utils/DataHelper';

// Define interface matching Excel columns
interface ExcelCredentialRow {
  UserName: string;
  Password: string;
  Role?: string;
}

// Load first sheet by default
const credentials = DataHelper.loadExcelData<ExcelCredentialRow[]>('creds.xlsx');
const firstCredential = credentials[0];
const username = firstCredential?.UserName;
const password = firstCredential?.Password;
```

#### Loading Specific Sheet

```typescript
// Load specific sheet by name
const testCases = DataHelper.loadExcelData<ExcelCredentialRow[]>('creds.xlsx', 'Test Cases');
const adminUser = testCases.find(user => user.Role === 'Admin');

// Load different sheet
const productionData = DataHelper.loadExcelData<any[]>('creds.xlsx', 'Production');
```

#### Getting All Sheet Names

```typescript
// Note: This requires direct XLSX usage
import * as XLSX from 'xlsx';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'test', 'data', 'creds.xlsx');
const workbook = XLSX.readFile(filePath);
const sheetNames = workbook.SheetNames;
console.log('Available sheets:', sheetNames);
```

### Complete Excel Example in Test

```typescript
import { test, expect } from '../../framework/core/BaseTest';
import { DemoPage } from '../pages/DemoPage';
import { DataHelper } from '../../framework/utils/DataHelper';

test.describe('Login Tests with Excel Data', () => {
  interface ExcelCredentialRow {
    UserName: string;
    Password: string;
    Role?: string;
  }

  // Load Excel data at module level
  const excelCredentials = DataHelper.loadExcelData<ExcelCredentialRow[]>('creds.xlsx', 'Test Cases');
  const primaryExcelCredential = excelCredentials[0];

  test('should login with Excel credentials', async ({ page, logger }, testInfo) => {
    const demoPage = new DemoPage(page, undefined, testInfo);
    
    await logger.step('Open login page', async () => {
      await demoPage.open();
    });
    
    await logger.step('Login with Excel credentials', async () => {
      await demoPage.enterUsername(primaryExcelCredential?.UserName ?? 'Admin');
      await demoPage.enterPassword(primaryExcelCredential?.Password ?? 'admin123');
      await demoPage.submitLogin();
    });
    
    await logger.step('Verify dashboard', async () => {
      await demoPage.verifyDashboardLoaded();
    });
  });

  // Data-driven test with all Excel rows
  excelCredentials.forEach((credential, index) => {
    test(`should login with user ${index + 1}: ${credential.UserName}`, async ({ page, logger }, testInfo) => {
      const demoPage = new DemoPage(page, undefined, testInfo);
      await demoPage.open();
      await demoPage.loginWith({
        username: credential.UserName,
        password: credential.Password
      });
      await demoPage.verifyDashboardLoaded();
    });
  });
});
```

### Excel Example in Page Object

```typescript
import { Page, TestInfo } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';
import { DataHelper } from '../../framework/utils/DataHelper';

interface ExcelCredentialRow {
  UserName: string;
  Password: string;
}

// Load Excel data at module level
const excelCredentials = DataHelper.loadExcelData<ExcelCredentialRow[]>('creds.xlsx', 'Test Cases');
const primaryExcelCredential = excelCredentials[0];

export class DemoPage extends BasePage {
  constructor(page: Page, url?: string, testInfo?: TestInfo) {
    super(page, url || 'https://example.com/login', testInfo);
  }

  async enterUsername(username?: string): Promise<void> {
    const resolvedUsername = username ?? primaryExcelCredential?.UserName ?? 'Admin';
    await this.fill('#username', resolvedUsername);
  }

  async enterPassword(password?: string): Promise<void> {
    const resolvedPassword = password ?? primaryExcelCredential?.Password ?? 'admin123';
    await this.fill('#password', resolvedPassword);
  }
}
```

## Advanced Patterns

### Pattern 1: Data Helper Class

Create a reusable helper class for common data operations:

```typescript
// test/utils/UserDataHelper.ts
import { DataHelper } from '../../framework/utils/DataHelper';

interface User {
  mobileNumber: string;
  password: string;
  otp: string;
  firstName: string;
  lastName: string;
}

export class UserDataHelper {
  private static userData = DataHelper.loadJsonData<any>('users.json');

  static getValidUser(index: number = 0): User {
    return this.userData.validUsers[index];
  }

  static getInvalidUser(index: number = 0) {
    return this.userData.invalidUsers[index];
  }

  static getAllValidUsers(): User[] {
    return this.userData.validUsers;
  }

  static getRandomValidUser(): User {
    const users = this.userData.validUsers;
    return users[Math.floor(Math.random() * users.length)];
  }

  static getUserByMobileNumber(mobileNumber: string): User | undefined {
    return this.userData.validUsers.find((u: User) => u.mobileNumber === mobileNumber);
  }
}

// Usage in test
import { UserDataHelper } from '../utils/UserDataHelper';

const user = UserDataHelper.getValidUser(0);
const randomUser = UserDataHelper.getRandomValidUser();
```

### Pattern 2: Environment-Specific Data

```typescript
// Load different data based on environment
const environment = process.env.ENV || 'dev';
const dataFile = `users-${environment}.json`;
const userData = DataHelper.loadJsonData<any>(dataFile);
```

### Pattern 3: Combining Multiple Data Sources

```typescript
import { DataHelper } from '../../framework/utils/DataHelper';

// Load from multiple sources
const jsonUsers = DataHelper.loadJsonData<any>('users.json');
const excelUsers = DataHelper.loadExcelData<any[]>('creds.xlsx', 'Users');
const csvProducts = DataHelper.loadCsvData<any[]>('products.csv');

// Combine or use selectively
const allUsers = [...jsonUsers.validUsers, ...excelUsers];
```

### Pattern 4: Dynamic Data Loading with Cache Control

```typescript
test.describe('Dynamic Data Tests', () => {
  test.beforeEach(() => {
    // Clear cache to reload data if files changed
    DataHelper.clearCache();
  });

  test('should use fresh data', async ({ page }) => {
    // Data will be reloaded from file
    const freshData = DataHelper.loadJsonData<any>('users.json');
    // Use freshData...
  });
});
```

### Pattern 5: Type-Safe Data Access

```typescript
// Define comprehensive interfaces
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

// Use with full type safety
const userData = DataHelper.loadJsonData<UserData>('users.json');

// TypeScript will autocomplete and type-check
const user = userData.validUsers[0];
const city = user.address.city; // Type-safe!
```

## Best Practices

### ✅ DO

1. **Place all data files in `test/data/` directory**
   ```typescript
   // ✅ Good
   DataHelper.loadJsonData('users.json'); // Looks in test/data/
   ```

2. **Use TypeScript interfaces for type safety**
   ```typescript
   interface User {
     username: string;
     password: string;
   }
   const users = DataHelper.loadJsonData<User[]>('users.json');
   ```

3. **Load data at module level for performance**
   ```typescript
   // ✅ Good - loaded once
   const userData = DataHelper.loadJsonData('users.json');
   
   test('test 1', () => {
     const user = userData.validUsers[0];
   });
   ```

4. **Use descriptive file names**
   ```typescript
   // ✅ Good
   'users.json', 'products.csv', 'credentials.xlsx'
   ```

5. **Clear cache when data changes during tests**
   ```typescript
   test.beforeEach(() => {
     DataHelper.clearCache();
   });
   ```

### ❌ DON'T

1. **Don't use absolute paths**
   ```typescript
   // ❌ Bad
   DataHelper.loadJsonData('/full/path/to/users.json');
   ```

2. **Don't load data inside loops**
   ```typescript
   // ❌ Bad - loads file multiple times
   for (let i = 0; i < 10; i++) {
     const data = DataHelper.loadJsonData('users.json');
   }
   
   // ✅ Good - load once
   const data = DataHelper.loadJsonData('users.json');
   for (let i = 0; i < 10; i++) {
     // Use data
   }
   ```

3. **Don't forget to handle missing data**
   ```typescript
   // ❌ Bad - may throw error
   const user = userData.validUsers[0];
   await login(user.username, user.password);
   
   // ✅ Good - handle missing data
   const user = userData.validUsers[0];
   if (user) {
     await login(user.username, user.password);
   }
   ```

## Troubleshooting

### File Not Found Error

**Problem:** `Could not load data from users.json`

**Solutions:**
- Ensure file exists in `test/data/` directory
- Check file name spelling (case-sensitive)
- Verify file extension matches format (.json, .csv, .xlsx)

### CSV Headers Not Matching

**Problem:** CSV properties don't match expected names

**Solutions:**
- Check CSV header row matches TypeScript interface
- Use column mapping option to rename columns
- Ensure headers don't have extra spaces

### Excel Sheet Not Found

**Problem:** `Sheet "Test Cases" not found`

**Solutions:**
- Verify sheet name spelling (case-sensitive)
- Check sheet exists in Excel file
- List available sheets using XLSX library
- Use first sheet by omitting sheetName parameter

### Data Not Updating

**Problem:** Changes to data file not reflected in tests

**Solutions:**
- Clear cache: `DataHelper.clearCache()`
- Restart test runner
- Verify file is saved

### Type Errors

**Problem:** TypeScript errors when accessing data

**Solutions:**
- Define proper TypeScript interfaces
- Use type assertions if needed: `as YourType`
- Check data structure matches interface

## Summary

The DataHelper utility provides a powerful and flexible way to manage test data:

- ✅ **JSON** - Best for structured, nested data
- ✅ **CSV** - Best for tabular data with simple structure
- ✅ **Excel** - Best for complex data with multiple sheets

All formats support:
- Automatic caching for performance
- TypeScript type safety
- Flexible loading options
- Easy integration with tests

Choose the format that best fits your data structure and team's workflow!

