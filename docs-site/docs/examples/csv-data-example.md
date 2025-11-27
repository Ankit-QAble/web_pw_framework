---
sidebar_position: 6
---

# CSV Data Example

This guide demonstrates how to use CSV files for test data management in your Playwright test suites.

## Overview

CSV files are ideal for simple tabular test data. The framework parses CSV files and converts them to arrays of objects, making them easy to use in data-driven tests.

## Table of Contents

- [File Structure](#file-structure)
- [Loading CSV Data](#loading-csv-data)
- [Complete Examples](#complete-examples)
- [Best Practices](#best-practices)

## File Structure

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

## Loading CSV Data

### Basic CSV Loading

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

### CSV with Custom Options

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

### CSV with Column Mapping

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

## Complete Examples

### Example 1: Basic Test with CSV Data

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
});
```

### Example 2: Data-Driven Testing with CSV

```typescript
import { test, expect } from '../../framework/core/BaseTest';
import { ProductPage } from '../pages/ProductPage';
import { DataHelper } from '../../framework/utils/DataHelper';

test.describe('Data-Driven Product Tests', () => {
  interface ProductRow {
    ProductID: string;
    ProductName: string;
    Price: string;
    Category: string;
  }

  const products = DataHelper.loadCsvData<ProductRow[]>('products.csv');

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

### Example 3: Filtering CSV Data

```typescript
import { DataHelper } from '../../framework/utils/DataHelper';

interface ProductRow {
  ProductID: string;
  ProductName: string;
  Price: string;
  Category: string;
}

const allProducts = DataHelper.loadCsvData<ProductRow[]>('products.csv');

// Filter by category
const electronics = allProducts.filter(p => p.Category === 'Electronics');
const furniture = allProducts.filter(p => p.Category === 'Furniture');

// Find specific product
const laptop = allProducts.find(p => p.ProductName === 'Laptop');
```

### Example 4: Using CSV Data in Page Objects

```typescript
import { Page, TestInfo } from '@playwright/test';
import { BasePage } from '../../framework/core/BasePage';
import { DataHelper } from '../../framework/utils/DataHelper';

interface ProductRow {
  ProductID: string;
  ProductName: string;
  Price: string;
  Category: string;
}

export class ProductPage extends BasePage {
  private static products = DataHelper.loadCsvData<ProductRow[]>('products.csv');

  constructor(page: Page, url?: string, testInfo?: TestInfo) {
    super(page, url || 'https://example.com/products', testInfo);
  }

  /**
   * Get product by ID
   */
  getProductById(productId: string): ProductRow | undefined {
    return ProductPage.products.find(p => p.ProductID === productId);
  }

  /**
   * Get products by category
   */
  getProductsByCategory(category: string): ProductRow[] {
    return ProductPage.products.filter(p => p.Category === category);
  }
}
```

### Example 5: CSV with Custom Delimiter

```typescript
import { DataHelper } from '../../framework/utils/DataHelper';

// CSV with semicolon delimiter
const data = DataHelper.loadCsvData('data.csv', {
  columns: true,
  delimiter: ';',
  skip_empty_lines: true
});
```

## Best Practices

### ✅ DO

1. **Use TypeScript interfaces matching CSV headers**
   ```typescript
   interface ProductRow {
     ProductID: string;
     ProductName: string;
   }
   const products = DataHelper.loadCsvData<ProductRow[]>('products.csv');
   ```

2. **Load data at module level**
   ```typescript
   // ✅ Good - loaded once
   const products = DataHelper.loadCsvData('products.csv');
   ```

3. **Use descriptive header names**
   ```csv
   ✅ Good: ProductID, ProductName, Price
   ❌ Bad: col1, col2, col3
   ```

4. **Handle missing data**
   ```typescript
   const product = products[0];
   if (product) {
     await searchProduct(product.ProductID);
   }
   ```

### ❌ DON'T

1. **Don't load CSV files inside loops**
   ```typescript
   // ❌ Bad - loads file multiple times
   for (let i = 0; i < 10; i++) {
     const data = DataHelper.loadCsvData('products.csv');
   }
   ```

2. **Don't forget headers**
   ```csv
   ❌ Bad - no headers
   Laptop,999.99
   Mouse,29.99
   
   ✅ Good - with headers
   ProductName,Price
   Laptop,999.99
   Mouse,29.99
   ```

3. **Don't use spaces in headers unnecessarily**
   ```csv
   ❌ Bad: Product ID, Product Name
   ✅ Good: ProductID, ProductName
   ```

## Troubleshooting

### CSV Headers Not Matching

**Problem:** CSV properties don't match expected names

**Solutions:**
- Check CSV header row matches TypeScript interface exactly
- Use column mapping option to rename columns
- Ensure headers don't have extra spaces
- Verify CSV encoding (should be UTF-8)

### Empty Data Returned

**Problem:** CSV loads but returns empty array

**Solutions:**
- Check CSV file has data rows (not just headers)
- Verify file path is correct (`test/data/`)
- Check for empty lines being skipped
- Verify delimiter matches CSV file

## Summary

CSV files provide a simple way to manage tabular test data:

- ✅ **Simple Format** - Easy to create and edit
- ✅ **Tabular Data** - Perfect for rows and columns
- ✅ **Type Safety** - Use TypeScript interfaces
- ✅ **Column Mapping** - Rename columns as needed
- ✅ **Custom Delimiters** - Support for various CSV formats

For more information, see [Data Sources Guide](../getting-started/DATA_SOURCES.md#csv-data-usage).

