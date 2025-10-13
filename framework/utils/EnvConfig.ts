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
    this.config = Object.fromEntries(
      Object.entries(process.env).map(([key, value]) => [key, value || ''])
    );
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

  /**
   * Get SMTP configuration
   */
  public getSmtpConfig(): {
    smtp: boolean;
    host: string;
    port: number;
    auth: {
      user: string;
      pass: string;
    };
  } {
    const provider = this.get('EMAIL_PROVIDER', 'gmail').toLowerCase();
    
    // Default Gmail configuration
    let defaultHost = 'smtp.gmail.com';
    let defaultPort = '587';
    let defaultUser = 'qable.gamer@gmail.com';
    let defaultPass = 'wwch ebob wwmh vqua';
    
    // Outlook/Office 365 configuration
    if (provider === 'outlook' || provider === 'office365' || provider === 'microsoft') {
      defaultHost = 'smtp.office365.com';
      defaultPort = '587';
      defaultUser = this.get('SMTP_USER', 'your-email@outlook.com');
      defaultPass = this.get('SMTP_PASS', 'your-password');
    }
    
    return {
      smtp: true,
      host: this.get('SMTP_HOST', defaultHost),
      port: parseInt(this.get('SMTP_PORT', defaultPort)),
      auth: {
        user: this.get('SMTP_USER', defaultUser),
        pass: this.get('SMTP_PASS', defaultPass),
      },
    };
  }

  /**
   * Generate dynamic email configuration based on test results
   * @param testStats - Real-time test execution statistics
   * @param environment - Environment name
   */
  public getDynamicEmailConfig(testStats?: { passed: number, failed: number, skipped: number, total: number }, environment?: string): {
    email: boolean;
    to: string[];
    subject: string;
    body: string;
  } {
    const env = environment || this.getEnvironment();
    const baseEmails = this.getBaseEmails(env);
    
    // Generate dynamic subject based on test results
    const passRate = testStats && testStats.total > 0 ? ((testStats.passed / testStats.total) * 100).toFixed(1) : '0';
    const status = testStats && testStats.failed > 0 ? '❌ FAILED' : '✅ PASSED';
    const subject = `${status} Automation Test Report - ${env.toUpperCase()} (${passRate}% Pass Rate)`;

    // Generate dynamic body based on test results
    let body = `Test execution completed for ${env} environment.\n\n`;
    if (testStats) {
      body += `📊 Test Results Summary:
• Total Tests: ${testStats.total}
• Passed: ${testStats.passed}
• Failed: ${testStats.failed}
• Skipped: ${testStats.skipped}
• Pass Rate: ${passRate}%

Generated at: ${new Date().toLocaleString()}`;
    }

    return {
      email: true,
      to: baseEmails,
      subject,
      body,
    };
  }

  /**
   * Get email provider configuration
   */
  public getEmailProviderConfig(): {
    provider: string;
    host: string;
    port: number;
    secure: boolean;
    requiresAppPassword: boolean;
  } {
    const provider = this.get('EMAIL_PROVIDER', 'gmail').toLowerCase();
    
    switch (provider) {
      case 'outlook':
      case 'office365':
      case 'microsoft':
        return {
          provider: 'outlook',
          host: 'smtp.office365.com',
          port: 587,
          secure: false, // Use STARTTLS
          requiresAppPassword: false, // Outlook uses regular password or app password
        };
      case 'gmail':
      default:
        return {
          provider: 'gmail',
          host: 'smtp.gmail.com',
          port: 587,
          secure: false, // Use STARTTLS
          requiresAppPassword: true, // Gmail requires app password
        };
    }
  }

  /**
   * Get base email recipients by environment
   */
  private getBaseEmails(environment: string): string[] {
    const emailEnvVar = environment === 'preprod' ? 'EMAIL_TO_PREPROD' : 'EMAIL_TO_DEV';
    const defaultEmails = environment === 'preprod' 
      ? ['ankit.patel@sadad.qa'] 
      : ['patelankitr123@gmail.com'];
    
    const envEmails = this.get(emailEnvVar);
    if (envEmails) {
      return envEmails.split(',').map(email => email.trim()).filter(email => email);
    }
    return defaultEmails;
  }
}

// Export a default instance
export const envConfig = EnvConfig.getInstance();