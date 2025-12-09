// @ts-nocheck - Suppress cached module resolution errors from Playwright's loader
import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';

// Define CSV parse options type locally to avoid import issues
interface CsvParseOptions {
  columns?: boolean | string[] | Record<string, string>;
  skip_empty_lines?: boolean;
  delimiter?: string;
  [key: string]: any;
}

// Built-in CSV parser (no external dependencies)
let parseCsv: (input: string, options?: CsvParseOptions) => any;

function getCsvParser() {
  if (!parseCsv) {
    // Built-in CSV parser that handles basic CSV files with configurable delimiters
    // Supports column mapping and empty line skipping
    parseCsv = (input: string, options?: CsvParseOptions) => {
      const lines = input.split('\n').filter((line: string) => {
        if (options?.skip_empty_lines) {
          return line.trim().length > 0;
        }
        return true;
      });
      
      if (lines.length === 0) return [];
      
      const delimiter = options?.delimiter || ',';
      const headers = lines[0].split(delimiter).map((h: string) => h.trim());
      
      // Handle column mapping if provided
      const columnMap = Array.isArray(options?.columns) 
        ? options.columns as string[]
        : typeof options?.columns === 'object' && options.columns !== null
        ? options.columns as Record<string, string>
        : null;
      
      return lines.slice(1).map((line: string) => {
        const values = line.split(delimiter);
        const obj: any = {};
        
        if (columnMap && typeof columnMap === 'object' && !Array.isArray(columnMap)) {
          // Use provided column mapping
          headers.forEach((header: string, i: number) => {
            const mappedKey = (columnMap as Record<string, string>)[header] || header;
            obj[mappedKey] = values[i]?.trim() || '';
          });
        } else if (Array.isArray(columnMap)) {
          // Use array of column names
          columnMap.forEach((colName: string, i: number) => {
            obj[colName] = values[i]?.trim() || '';
          });
        } else {
          // Default: use headers as keys
          headers.forEach((header: string, i: number) => {
            obj[header] = values[i]?.trim() || '';
          });
        }
        
        return obj;
      });
    };
  }
  return parseCsv;
}

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
   * @param csvOptions - CSV parsing options (defaults to columns: true)
   */
  public static loadCsvData<T = any>(fileName: string, csvOptions?: CsvParseOptions): T {
    const cacheKey = this.buildCacheKey(fileName, 'csv', JSON.stringify(csvOptions ?? {}));
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    try {
      const filePath = this.resolveDataPath(fileName);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const parsed = getCsvParser()(fileContent, {
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
 * Flexible data access helper - works with any JSON file and property
 * 
 * Usage examples:
 * - getData('users.json', 'validUsers') - returns array
 * - getData('users.json', 'validUsers', true) - returns first item (direct property access)
 * - getData('users.json', 'validUsers.mobileNumber', true) - returns first user's mobileNumber
 * - getData('products.json', 'items', true) - returns first product
 */
export function getData<T = any>(
  fileName: string, 
  propertyPath?: string, 
  getFirst: boolean = false
): T {
  const data = DataHelper.loadJsonData<any>(fileName);
  
  if (!propertyPath) {
    return data as T;
  }
  
  // Handle dot notation paths (e.g., 'validUsers.mobileNumber')
  const parts = propertyPath.split('.');
  let result: any = data;
  
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (result === null || result === undefined) {
      return undefined as T;
    }
    result = result[part];
    
    // If this is an array and getFirst is true, get first item
    // But only if we're at the last part OR if result is an array
    if (Array.isArray(result) && getFirst && i === parts.length - 1) {
      return (result.length > 0 ? result[0] : undefined) as T;
    }
  }
  
  // If result is array and getFirst is true, return first item
  if (Array.isArray(result) && getFirst) {
    return (result.length > 0 ? result[0] : undefined) as T;
  }
  
  return result as T;
}

/**
 * Convenience function for direct property access (returns first item if array)
 * 
 * Usage:
 * - getFirst('users.json', 'validUsers') - returns first validUser object
 * - getFirst('users.json', 'validUsers').mobileNumber - chain property access
 */
export function getFirst<T = any>(fileName: string, propertyPath: string): T {
  return getData<T>(fileName, propertyPath, true);
}

/**
 * Legacy testData object for backward compatibility
 * Use getData() or getFirst() for new code - they work with any JSON file
 */
export const testData = {
  get validUsers() {
    return DataHelper.loadJsonData<any>('users.json').validUsers;
  },
  get validUser() {
    // Direct access to first valid user - use: testData.validUser.mobileNumber
    return DataHelper.loadJsonData<any>('users.json').validUsers[0];
  },
  get invalidUsers() {
    return DataHelper.loadJsonData<any>('users.json').invalidUsers;
  },
  get invalidUser() {
    // Direct access to first invalid user
    return DataHelper.loadJsonData<any>('users.json').invalidUsers[0];
  },
  get users() {
    return DataHelper.loadJsonData<any>('users.json');
  }
};

