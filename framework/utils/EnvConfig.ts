import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Environment Configuration Utility
 * Handles loading environment-specific configuration files
 */
export class EnvConfig {
  private static instance: EnvConfig;
  private config: Record<string, string> = {};
  
  private constructor() {
    this.loadEnvironment();
  }
  
  /**
   * Get singleton instance of EnvConfig
   */
  public static getInstance(): EnvConfig {
    if (!EnvConfig.instance) {
      EnvConfig.instance = new EnvConfig();
    }
    return EnvConfig.instance;
  }
  
  /**
   * Load environment configuration based on NODE_ENV or default
   */
  private loadEnvironment(): void {
    // Prefer a single .env file if present, otherwise leave process.env as-is
    const rootDir = process.cwd();
    const dotEnvPath = path.join(rootDir, '.env');

    if (fs.existsSync(dotEnvPath)) {
      const result = dotenv.config({ path: dotEnvPath });
      if (result.error) {
        console.error('Error loading .env:', result.error);
      } else {
        console.log('Loaded environment from .env');
      }
    }

    // Store all environment variables in config object
    this.config = { ...process.env };
  }
  
  /**
   * Get environment variable value
   * @param key Environment variable key
   * @param defaultValue Optional default value if key doesn't exist
   */
  public get(key: string, defaultValue: string = ''): string {
    return this.config[key] || process.env[key] || defaultValue;
  }
  
  /**
   * Get current environment name
   */
  public getEnvironment(): string {
    return this.get('ENVIRONMENT', 'staging');
  }
  
  /**
   * Get base URL for the current environment
   */
  public getBaseUrl(): string {
    return this.get('BASE_URL', 'https://aks-panel.sadad.qa/auth/login');
  }
  
  /**
   * Switch to a different environment
   * @param env Environment name (development, preprod, production)
   */
  public static switchEnvironment(env: 'development' | 'preprod' | 'production'): void {
    process.env.NODE_ENV = env;
    // Re-initialize the instance to load the new environment
    EnvConfig.instance = new EnvConfig();
    console.log(`Switched to ${env} environment`);
  }
}

// Export a default instance
export const envConfig = EnvConfig.getInstance();