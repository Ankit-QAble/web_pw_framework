import * as fs from 'fs';
import * as path from 'path';

/**
 * Data Helper Utility
 * Provides methods to load and manage JSON data files from the test/data directory
 */
export class DataHelper {
  private static cache: Map<string, any> = new Map();

  /**
   * Load JSON data from file (cached for performance)
   * @param fileName - Name of the JSON file (e.g., 'users.json')
   * @returns Parsed JSON data
   */
  public static loadJsonData<T = any>(fileName: string): T {
    // Check cache first
    if (this.cache.has(fileName)) {
      return this.cache.get(fileName);
    }

    try {
      const filePath = path.join(process.cwd(), 'test', 'data', fileName);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(fileContent) as T;
      
      // Cache the data for future use
      this.cache.set(fileName, data);
      
      console.log(`✅ Loaded data from: ${fileName}`);
      return data;
    } catch (error) {
      console.error(`❌ Failed to load data from ${fileName}:`, error);
      throw new Error(`Could not load data from ${fileName}`);
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

