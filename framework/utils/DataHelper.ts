import * as fs from 'fs';
import * as path from 'path';
import {parse as parseCsv, Options as CsvParseOptions} from 'csv-parse/sync';
import * as XLSX from 'xlsx';

type DataFormat = 'json' | 'csv' | 'excel';

interface DataLoadOptions {
  format?: DataFormat;
  sheetName?: string;
  csvOptions?: CsvParseOptions;
}

/**
 * Data Helper Utility
 * Provides methods to load and manage JSON/CSV/Excel data files from the test/data directory
 */
export class DataHelper {
  private static cache: Map<string, any> = new Map();

  private static buildCacheKey(fileName: string, format: DataFormat, extra = ''): string {
    return `${format}:${fileName}:${extra}`;
  }

  private static resolveDataPath(fileName: string): string {
    return path.join(process.cwd(), 'test', 'data', fileName);
  }

  /**
   * Smart loader that detects format via extension or explicit option.
   * @param fileName - Data file name
   * @param options - Format overrides and parser options
   */
  public static loadData<T = any>(fileName: string, options?: DataLoadOptions): T {
    const format = options?.format ?? this.inferFormat(fileName);

    switch (format) {
      case 'csv':
        return this.loadCsvData<T>(fileName, options?.csvOptions);
      case 'excel':
        return this.loadExcelData<T>(fileName, options?.sheetName);
      case 'json':
      default:
        return this.loadJsonData<T>(fileName);
    }
  }

  /**
   * Load JSON data from file (cached for performance)
   * @param fileName - Name of the JSON file (e.g., 'users.json')
   * @returns Parsed JSON data
   */
  public static loadJsonData<T = any>(fileName: string): T {
    const cacheKey = this.buildCacheKey(fileName, 'json');
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const filePath = this.resolveDataPath(fileName);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(fileContent) as T;

      // Cache the data for future use
      this.cache.set(cacheKey, data);

      console.log(`✅ Loaded data from: ${fileName}`);
      return data;
    } catch (error) {
      console.error(`❌ Failed to load data from ${fileName}:`, error);
      throw new Error(`Could not load data from ${fileName}`);
    }
  }

  /**
   * Load CSV data into JSON objects/arrays
   * @param fileName - CSV file name
   * @param csvOptions - csv-parse options (defaults to columns: true)
   */
  public static loadCsvData<T = any>(fileName: string, csvOptions?: CsvParseOptions): T {
    const cacheKey = this.buildCacheKey(fileName, 'csv', JSON.stringify(csvOptions ?? {}));
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const filePath = this.resolveDataPath(fileName);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const parsed = parseCsv(fileContent, {
        columns: true,
        skip_empty_lines: true,
        ...csvOptions
      }) as T;

      this.cache.set(cacheKey, parsed);
      console.log(`✅ Loaded CSV data from: ${fileName}`);
      return parsed;
    } catch (error) {
      console.error(`❌ Failed to load CSV data from ${fileName}:`, error);
      throw new Error(`Could not load CSV data from ${fileName}`);
    }
  }

  /**
   * Load Excel data (XLS/XLSX) as JSON rows
   * @param fileName - Excel file name
   * @param sheetName - Optional sheet to read (defaults to first)
   */
  public static loadExcelData<T = any>(fileName: string, sheetName?: string): T {
    const extra = sheetName ?? '';
    const cacheKey = this.buildCacheKey(fileName, 'excel', extra);
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const filePath = this.resolveDataPath(fileName);
      const workbook = XLSX.readFile(filePath);
      const sheet = sheetName ?? workbook.SheetNames[0];

      if (!sheet || !workbook.Sheets[sheet]) {
        throw new Error(`Sheet "${sheetName}" not found in ${fileName}`);
      }

      const json = XLSX.utils.sheet_to_json(workbook.Sheets[sheet], {defval: null}) as T;
      this.cache.set(cacheKey, json);
      console.log(`✅ Loaded Excel data from: ${fileName} (sheet: ${sheet})`);
      return json;
    } catch (error) {
      console.error(`❌ Failed to load Excel data from ${fileName}:`, error);
      throw new Error(`Could not load Excel data from ${fileName}`);
    }
  }

  /**
   * Clear the cache (useful for testing or reloading data)
   */
  public static clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get a specific property from JSON data
   * @param fileName - Name of the JSON file
   * @param propertyPath - Path to the property (e.g., 'validUsers[0]')
   * @returns The property value
   */
  public static getData<T = any>(fileName: string, propertyPath?: string): T {
    const data = this.loadJsonData(fileName);
    
    if (!propertyPath) {
      return data;
    }

    // Handle simple property path (you can extend this for more complex paths)
    return this.getPropertyByPath(data, propertyPath);
  }

  /**
   * Get property by path (supports dot notation and array indexing)
   */
  private static getPropertyByPath(obj: any, path: string): any {
    const parts = path.replace(/\[(\w+)\]/g, '.$1').split('.');
    let result = obj;
    
    for (const part of parts) {
      if (result === null || result === undefined) {
        return undefined;
      }
      result = result[part];
    }
    
    return result;
  }

  private static inferFormat(fileName: string): DataFormat {
    const ext = path.extname(fileName).toLowerCase();
    if (ext === '.csv') {
      return 'csv';
    }
    if (ext === '.xls' || ext === '.xlsx') {
      return 'excel';
    }
    return 'json';
  }
}

/**
 * Simple direct access to test data
 * Use: testData.validUsers[0].username
 */
export const testData = {
  get validUsers() {
    return DataHelper.loadJsonData<any>('users.json').validUsers;
  },
  get invalidUsers() {
    return DataHelper.loadJsonData<any>('users.json').invalidUsers;
  },
  get users() {
    return DataHelper.loadJsonData<any>('users.json');
  }
};

