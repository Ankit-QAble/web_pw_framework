---
id: data-sources
title: Working with JSON, CSV, and Excel data
sidebar_position: 40
description: How to use DataHelper to load test fixtures from JSON, CSV, and Excel files plus practical examples.
---

The `framework/utils/DataHelper.ts` utility centralizes every test data lookup. It supports three formats out of the box:

- JSON (`*.json`) – parsed into plain objects (cached)
- CSV (`*.csv`) – parsed via `csv-parse/sync` and returned as arrays of objects
- Excel (`*.xls`, `*.xlsx`) – parsed with `xlsx` and returned as arrays of rows

## Basic usage patterns

### Auto-detect by extension
```ts
import {DataHelper} from '../../framework/utils/DataHelper';

const books = DataHelper.loadData('Books.csv');        // returns array of rows
const users = DataHelper.loadData('users.json');       // returns JSON object
const creds = DataHelper.loadData('creds.xlsx');       // first sheet by default
```

### Explicit loaders
```ts
const jsonData = DataHelper.loadJsonData<{validUsers: any[]}>('users.json');

const csvRows = DataHelper.loadCsvData('Books.csv', {
  columns: true,
  skip_empty_lines: true
});

const excelSheet = DataHelper.loadExcelData('creds.xlsx', 'Test Cases'); // named sheet
```

### Cache control
```ts
DataHelper.clearCache(); // useful inside beforeEach/afterEach when files change
```

## DemoPage example (Excel only)

`test/pages/DemoPage.ts` shows the minimal way to pull username/password straight from Excel:

```ts
const excelCredentials = DataHelper.loadExcelData('creds.xlsx', 'Test Cases');
const primaryExcelCredential = excelCredentials[0];

await this.fill(DemoPageLocators.usernameField, primaryExcelCredential?.UserName ?? 'Admin');
await this.fill(DemoPageLocators.passwordField, primaryExcelCredential?.Password ?? 'admin123');
```

The same pattern works in specs or fixtures—load once at module level, then reuse.

## CSV example (Books.csv)

```ts
type BookCsvRow = {
  TestBooks: string;
  NewBooks: string;
};

const books = DataHelper.loadCsvData<BookCsvRow[]>('Books.csv');
const firstBook = books[0]?.TestBooks;
```

## Tips

- Keep all source files under `test/data/` so relative paths stay consistent.
- CSV headers become object keys; prefer lowercase/underscore headers for readability.
- Excel loaders default to the first sheet unless you pass a `sheetName`.
- Wrap lookups in helper functions/classes if the same dataset feeds multiple tests.

