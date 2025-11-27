---
sidebar_position: 5
---

# Excel Data Example

This guide demonstrates how to use Excel files (`.xlsx` or `.xls`) for test data management in your Playwright test suites.

## Overview

Excel files are ideal for complex test data with multiple sheets. The framework supports reading Excel files and converting them to JSON objects for easy use in tests.

## Table of Contents

- [File Structure](#file-structure)
- [Loading Excel Data](#loading-excel-data)
- [Complete Examples](#complete-examples)
- [Best Practices](#best-practices)

## File Structure

Place Excel files in `test/data/` directory. Excel files can contain multiple sheets.

**Example Excel Structure (`creds.xlsx`):**

| Sheet: "Test Cases" |        |        |
|---------------------|--------|--------|
| UserName            | Password | Role   |
| Admin               | admin123 | Admin  |
| User1               | password1| User   |
| User2               | password2| User   |

## Loading Excel Data

### Basic Excel Loading

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

### Loading Specific Sheet

```typescript
// Load specific sheet by name
const testCases = DataHelper.loadExcelData<ExcelCredentialRow[]>('creds.xlsx', 'Test Cases');
const adminUser = testCases.find(user => user.Role === 'Admin');

// Load different sheet
const productionData = DataHelper.loadExcelData<any[]>('creds.xlsx', 'Production');
```

### Getting All Sheet Names

```typescript
// Note: This requires direct XLSX usage
import * as XLSX from 'xlsx';
import * as path from 'path';

const filePath = path.join(process.cwd(), 'test', 'data', 'creds.xlsx');
const workbook = XLSX.readFile(filePath);
const sheetNames = workbook.SheetNames;
console.log('Available sheets:', sheetNames);
```

## Complete Examples

### Example 1: Basic Test with Excel Data

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
});
```

### Example 2: Data-Driven Testing with Excel

```typescript
import { test, expect } from '../../framework/core/BaseTest';
import { DemoPage } from '../pages/DemoPage';
import { DataHelper } from '../../framework/utils/DataHelper';

test.describe('Data-Driven Login Tests with Excel', () => {
  interface ExcelCredentialRow {
    UserName: string;
    Password: string;
    Role?: string;
  }

  const excelCredentials = DataHelper.loadExcelData<ExcelCredentialRow[]>('creds.xlsx', 'Test Cases');

  // Test with all Excel rows
  excelCredentials.forEach((credential, index) => {
    test(`should login with user ${index + 1}: ${credential.UserName}`, async ({ page, logger }, testInfo) => {
      const demoPage = new DemoPage(page, undefined, testInfo);
      await demoPage.open();
      
      await logger.step(`Login with ${credential.UserName}`, async () => {
        await demoPage.loginWith({
          username: credential.UserName,
          password: credential.Password
        });
      });
      
      await logger.step('Verify dashboard', async () => {
        await demoPage.verifyDashboardLoaded();
      });
    });
  });
});
```

### Example 3: Using Excel Data in Page Objects

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

### Example 4: Filtering Excel Data

```typescript
import { DataHelper } from '../../framework/utils/DataHelper';

interface ExcelCredentialRow {
  UserName: string;
  Password: string;
  Role: string;
}

const allCredentials = DataHelper.loadExcelData<ExcelCredentialRow[]>('creds.xlsx', 'Test Cases');

// Filter by role
const adminUsers = allCredentials.filter(user => user.Role === 'Admin');
const regularUsers = allCredentials.filter(user => user.Role === 'User');

// Find specific user
const adminUser = allCredentials.find(user => user.UserName === 'Admin');
```

### Example 5: Multiple Sheets

```typescript
import { DataHelper } from '../../framework/utils/DataHelper';

// Load different sheets
const testCases = DataHelper.loadExcelData<any[]>('creds.xlsx', 'Test Cases');
const productionData = DataHelper.loadExcelData<any[]>('creds.xlsx', 'Production');
const stagingData = DataHelper.loadExcelData<any[]>('creds.xlsx', 'Staging');

// Use appropriate data based on environment
const environment = process.env.ENV || 'test';
const data = environment === 'production' ? productionData : testCases;
```

## Best Practices

### ✅ DO

1. **Define TypeScript interfaces matching Excel columns**
   ```typescript
   interface ExcelCredentialRow {
     UserName: string;
     Password: string;
   }
   const data = DataHelper.loadExcelData<ExcelCredentialRow[]>('creds.xlsx');
   ```

2. **Load data at module level**
   ```typescript
   // ✅ Good - loaded once
   const credentials = DataHelper.loadExcelData('creds.xlsx', 'Test Cases');
   ```

3. **Use descriptive sheet names**
   ```
   ✅ Good: "Test Cases", "Production", "Staging"
   ❌ Bad: "Sheet1", "Sheet2"
   ```

4. **Handle missing data**
   ```typescript
   const user = credentials[0];
   const username = user?.UserName ?? 'default';
   ```

### ❌ DON'T

1. **Don't load Excel files inside loops**
   ```typescript
   // ❌ Bad - loads file multiple times
   for (let i = 0; i < 10; i++) {
     const data = DataHelper.loadExcelData('creds.xlsx');
   }
   ```

2. **Don't forget to specify sheet name when needed**
   ```typescript
   // ❌ Bad - might load wrong sheet
   const data = DataHelper.loadExcelData('creds.xlsx');
   
   // ✅ Good - explicit sheet name
   const data = DataHelper.loadExcelData('creds.xlsx', 'Test Cases');
   ```

## Troubleshooting

### Sheet Not Found Error

**Problem:** `Sheet "Test Cases" not found`

**Solutions:**
- Verify sheet name spelling (case-sensitive)
- Check sheet exists in Excel file
- List available sheets using XLSX library
- Use first sheet by omitting sheetName parameter

### Column Names Don't Match

**Problem:** Properties don't match Excel column headers

**Solutions:**
- Ensure Excel column headers match TypeScript interface exactly
- Check for extra spaces in Excel headers
- Use optional properties (`?`) in interface for missing columns

## Summary

Excel files provide a powerful way to manage test data:

- ✅ **Multiple Sheets** - Organize data by environment or test type
- ✅ **Easy Editing** - Non-technical team members can update data
- ✅ **Type Safety** - Use TypeScript interfaces for validation
- ✅ **Caching** - Automatic caching for performance
- ✅ **Flexibility** - Load specific sheets or all data

For more information, see [Data Sources Guide](../getting-started/DATA_SOURCES.md#excel-data-usage).

