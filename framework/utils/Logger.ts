export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3
}

export class Logger {
  private className: string;
  private logLevel: LogLevel;

  constructor(className: string, logLevel: LogLevel = LogLevel.INFO) {
    this.className = className;
    this.logLevel = process.env.LOG_LEVEL ? 
      LogLevel[process.env.LOG_LEVEL as keyof typeof LogLevel] : logLevel;
  }

  /**
   * Log debug message
   */
  debug(message: string, ...args: any[]): void {
    if (this.logLevel <= LogLevel.DEBUG) {
      this.log('DEBUG', message, ...args);
    }
  }

  /**
   * Log info message
   */
  info(message: string, ...args: any[]): void {
    if (this.logLevel <= LogLevel.INFO) {
      this.log('INFO', message, ...args);
    }
  }

  /**
   * Log warning message
   */
  warn(message: string, ...args: any[]): void {
    if (this.logLevel <= LogLevel.WARN) {
      this.log('WARN', message, ...args);
    }
  }

  /**
   * Log error message
   */
  error(message: string, error?: Error, ...args: any[]): void {
    if (this.logLevel <= LogLevel.ERROR) {
      if (error) {
        this.log('ERROR', `${message} - ${error.message}`, error.stack, ...args);
      } else {
        this.log('ERROR', message, ...args);
      }
    }
  }

  /**
   * Log step for test reporting
   */
  step(stepName: string, action: () => Promise<void> | void): Promise<void> | void {
    this.info(`🔹 Step: ${stepName}`);
    const result = action();
    
    if (result instanceof Promise) {
      return result
        .then(() => {
          this.info(`✅ Step completed: ${stepName}`);
        })
        .catch((error) => {
          this.error(`❌ Step failed: ${stepName}`, error);
          throw error;
        });
    } else {
      this.info(`✅ Step completed: ${stepName}`);
      return result;
    }
  }

  /**
   * Log test start
   */
  testStart(testName: string): void {
    this.info(`🚀 Test Started: ${testName}`);
    this.info('='.repeat(50));
  }

  /**
   * Log test end
   */
  testEnd(testName: string, success: boolean = true): void {
    this.info('='.repeat(50));
    if (success) {
      this.info(`✅ Test Passed: ${testName}`);
    } else {
      this.error(`❌ Test Failed: ${testName}`);
    }
  }

  /**
   * Log assertion
   */
  assertion(description: string, expected: any, actual: any): void {
    this.info(`🔍 Assertion: ${description}`);
    this.info(`   Expected: ${JSON.stringify(expected)}`);
    this.info(`   Actual: ${JSON.stringify(actual)}`);
  }

  /**
   * Log API request
   */
  apiRequest(method: string, url: string, payload?: any): void {
    this.info(`🌐 API ${method}: ${url}`);
    if (payload) {
      this.debug(`   Payload: ${JSON.stringify(payload, null, 2)}`);
    }
  }

  /**
   * Log API response
   */
  apiResponse(status: number, responseTime: number, body?: any): void {
    const statusIcon = status >= 200 && status < 300 ? '✅' : '❌';
    this.info(`${statusIcon} API Response: ${status} (${responseTime}ms)`);
    if (body) {
      this.debug(`   Response: ${JSON.stringify(body, null, 2)}`);
    }
  }

  /**
   * Core logging method
   */
  private log(level: string, message: string, ...args: any[]): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] [${this.className}] ${message}`;
    
    switch (level) {
      case 'DEBUG':
        console.debug(logMessage, ...args);
        break;
      case 'INFO':
        console.info(logMessage, ...args);
        break;
      case 'WARN':
        console.warn(logMessage, ...args);
        break;
      case 'ERROR':
        console.error(logMessage, ...args);
        break;
      default:
        console.log(logMessage, ...args);
    }
  }

  /**
   * Create a child logger with additional context
   */
  child(context: string): Logger {
    return new Logger(`${this.className}.${context}`, this.logLevel);
  }

  /**
   * Set log level
   */
  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  /**
   * Get current log level
   */
  getLogLevel(): LogLevel {
    return this.logLevel;
  }
}