import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as path from 'path';

export interface EmailConfig {
  email: boolean;
  to: string[];
  subject: string;
  body: string;
}

export interface SmtpConfig {
  smtp: boolean;
  host: string;
  port: number;
  auth: {
    user: string;
    pass: string;
  };
}

export class EmailService {
  private static instance: EmailService;
  private transporter: nodemailer.Transporter | null = null;

  private constructor() {}

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  /**
   * Initialize email transporter with SMTP configuration
   */
  public async initializeTransporter(smtpConfig: SmtpConfig, providerConfig?: { provider: string; host: string; port: number; secure: boolean; requiresAppPassword: boolean }): Promise<void> {
    if (!smtpConfig.smtp) {
      throw new Error('SMTP configuration is disabled');
    }

    // Use provider-specific configuration if available
    const config: any = {
      host: providerConfig?.host || smtpConfig.host,
      port: providerConfig?.port || smtpConfig.port,
      secure: providerConfig?.secure !== undefined ? providerConfig.secure : (smtpConfig.port === 465),
      auth: {
        user: smtpConfig.auth.user,
        pass: smtpConfig.auth.pass,
      },
    };

    // Add provider-specific options
    if (providerConfig?.provider === 'outlook') {
      // Outlook/Office 365 specific configuration
      config.tls = {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
      };
    }

    this.transporter = nodemailer.createTransport(config);

    // Verify connection configuration
    try {
      await this.transporter.verify();
      console.log(`SMTP connection verified successfully for ${providerConfig?.provider || 'default'} provider`);
    } catch (error) {
      console.error('SMTP connection failed:', error);
      if (providerConfig?.requiresAppPassword) {
        console.error('Note: This provider requires an app-specific password. Please check your email provider documentation.');
      }
      throw error;
    }
  }

  /**
   * Send test report email with Allure report attachment
   */
  public async sendTestReport(
    emailConfig: EmailConfig, 
    smtpConfig: SmtpConfig, 
    providerConfig?: { provider: string; host: string; port: number; secure: boolean; requiresAppPassword: boolean },
    providedStats?: { passed: number, failed: number, skipped: number, total: number }
  ): Promise<void> {
    console.log('EmailService.sendTestReport called');
    console.log('Email config:', { email: emailConfig.email, to: emailConfig.to, subject: emailConfig.subject });
    console.log('SMTP config:', { smtp: smtpConfig.smtp, host: smtpConfig.host, port: smtpConfig.port, user: smtpConfig.auth.user });
    console.log('Provider config:', providerConfig);
    
    if (!emailConfig.email) {
      console.log('Email reporting is disabled');
      return;
    }

    if (!smtpConfig.smtp) {
      console.log('SMTP is disabled');
      return;
    }

    if (!this.transporter) {
      console.log('Initializing SMTP transporter...');
      await this.initializeTransporter(smtpConfig, providerConfig);
    }

    const playwrightReportPath = path.join(process.cwd(), 'playwright-report', 'index.html');
    const attachments = [];

    // Check if Playwright report exists
    if (fs.existsSync(playwrightReportPath)) {
      attachments.push({
        filename: 'playwright-report.html',
        path: playwrightReportPath,
        contentType: 'text/html'
      });
      console.log('Playwright report found and will be attached');
    } else {
      console.warn('Playwright report not found at:', playwrightReportPath);
    }

    // Check for test results directory
    const testResultsPath = path.join(process.cwd(), 'test-results');
    if (fs.existsSync(testResultsPath)) {
      // Add any failed test screenshots
      const screenshotFiles = this.getScreenshotFiles(testResultsPath);
      screenshotFiles.forEach(file => {
        attachments.push({
          filename: path.basename(file),
          path: file
        });
      });
    }

    // Get test statistics
    const testStats = providedStats || await this.getTestStatistics();

    const mailOptions = {
      from: smtpConfig.auth.user,
      to: emailConfig.to.join(', '),
      subject: emailConfig.subject,
      html: this.generateEmailBody(emailConfig.body, attachments.length > 0, testStats),
      attachments: attachments
    };

    try {
      const info = await this.transporter!.sendMail(mailOptions);
      console.log('Test report email sent successfully:', info.messageId);
    } catch (error) {
      console.error('Failed to send test report email:', error);
      throw error;
    }
  }

  /**
   * Generate HTML email body with test results summary
   */
  private generateEmailBody(body: string, hasAttachments: boolean, testStats?: { passed: number, failed: number, skipped: number, total: number }): string {
    const timestamp = new Date().toISOString();
    const reportUrl = process.env.BASE_URL || 'http://localhost:3000';
    
    // Get test statistics from Allure results if available
    let testSummaryHtml = '';
    if (testStats) {
      const passRate = testStats.total > 0 ? ((testStats.passed / testStats.total) * 100).toFixed(1) : '0';
      testSummaryHtml = `
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 15px 0;">
          <h3>📊 Test Execution Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background-color: #e9ecef;">
              <th style="padding: 8px; text-align: left; border: 1px solid #dee2e6;">Status</th>
              <th style="padding: 8px; text-align: left; border: 1px solid #dee2e6;">Count</th>
              <th style="padding: 8px; text-align: left; border: 1px solid #dee2e6;">Percentage</th>
            </tr>
            <tr style="background-color: ${testStats.passed > 0 ? '#d4edda' : '#f8f9fa'};">
              <td style="padding: 8px; border: 1px solid #dee2e6;">✅ Passed</td>
              <td style="padding: 8px; border: 1px solid #dee2e6;">${testStats.passed}</td>
              <td style="padding: 8px; border: 1px solid #dee2e6;">${testStats.total > 0 ? ((testStats.passed / testStats.total) * 100).toFixed(1) : '0'}%</td>
            </tr>
            <tr style="background-color: ${testStats.failed > 0 ? '#f8d7da' : '#f8f9fa'};">
              <td style="padding: 8px; border: 1px solid #dee2e6;">❌ Failed</td>
              <td style="padding: 8px; border: 1px solid #dee2e6;">${testStats.failed}</td>
              <td style="padding: 8px; border: 1px solid #dee2e6;">${testStats.total > 0 ? ((testStats.failed / testStats.total) * 100).toFixed(1) : '0'}%</td>
            </tr>
            <tr style="background-color: ${testStats.skipped > 0 ? '#fff3cd' : '#f8f9fa'};">
              <td style="padding: 8px; border: 1px solid #dee2e6;">⏭️ Skipped</td>
              <td style="padding: 8px; border: 1px solid #dee2e6;">${testStats.skipped}</td>
              <td style="padding: 8px; border: 1px solid #dee2e6;">${testStats.total > 0 ? ((testStats.skipped / testStats.total) * 100).toFixed(1) : '0'}%</td>
            </tr>
            <tr style="background-color: #e9ecef; font-weight: bold;">
              <td style="padding: 8px; border: 1px solid #dee2e6;">📈 Total</td>
              <td style="padding: 8px; border: 1px solid #dee2e6;">${testStats.total}</td>
              <td style="padding: 8px; border: 1px solid #dee2e6;">100%</td>
            </tr>
          </table>
          <p style="margin: 10px 0 0 0; font-size: 14px; color: #6c757d;">
            <strong>Pass Rate:</strong> ${passRate}% | 
            <strong>Status:</strong> ${testStats.failed === 0 ? '✅ All tests passed' : '❌ Some tests failed'}
          </p>
        </div>
      `;
    }

    return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { background-color: #007bff; color: white; padding: 15px; border-radius: 5px 5px 0 0; }
          .content { background-color: white; padding: 20px; border: 1px solid #dee2e6; border-radius: 0 0 5px 5px; }
          .footer { margin-top: 20px; padding-top: 15px; border-top: 1px solid #dee2e6; color: #6c757d; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0;">🚀 Test Execution Report</h2>
          </div>
          <div class="content">
            <p><strong>📝 Message:</strong> ${body}</p>
            <p><strong>🕒 Execution Time:</strong> ${timestamp}</p>
            <p><strong>🌍 Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
            <p><strong>🔗 Base URL:</strong> ${reportUrl}</p>
            
            ${testSummaryHtml}
            
            ${hasAttachments ? 
              '<div style="background-color: #e7f3ff; padding: 15px; border-radius: 5px; margin: 15px 0;"><p><strong>📎 Attachments:</strong> Playwright HTML report and test screenshots are attached to this email.</p></div>' : 
              '<div style="background-color: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0;"><p><em>⚠️ No test artifacts found to attach.</em></p></div>'
            }
          </div>
          <div class="footer">
            <p><em>This is an automated email from Playwright Test Framework</em></p>
          </div>
        </div>
      </body>
    </html>
    `;
  }

  /**
   * Get test statistics by reading the JSON report
   */
  private async getTestStatistics(): Promise<{ passed: number, failed: number, skipped: number, total: number } | undefined> {
    try {
      const jsonReportPath = path.join(process.cwd(), 'test-results', 'report.json');
      
      // Wait for the report file to be generated (max 5 seconds)
      let retries = 10;
      while (retries > 0) {
        if (fs.existsSync(jsonReportPath)) {
          break;
        }
        console.log(`Waiting for JSON report generation... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, 500));
        retries--;
      }
      
      if (fs.existsSync(jsonReportPath)) {
        console.log('Reading test statistics from JSON report...');
        // Add a small delay to ensure file write is complete
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const reportContent = fs.readFileSync(jsonReportPath, 'utf8');
        const report = JSON.parse(reportContent);
        
        // Count stats from the JSON report structure
        let passed = 0;
        let failed = 0;
        let skipped = 0;
        let total = 0;

        // Iterate through suites and specs to count results
        const processSuite = (suite: any) => {
          if (suite.specs) {
            suite.specs.forEach((spec: any) => {
              if (spec.tests && spec.tests.length > 0) {
                // Get the last result of the test (in case of retries)
                const lastResult = spec.tests[spec.tests.length - 1].results[0];
                if (lastResult) {
                  total++;
                  if (lastResult.status === 'passed') passed++;
                  else if (lastResult.status === 'failed' || lastResult.status === 'timedOut') failed++;
                  else if (lastResult.status === 'skipped') skipped++;
                }
              }
            });
          }
          if (suite.suites) {
            suite.suites.forEach((childSuite: any) => processSuite(childSuite));
          }
        };

        if (report.suites) {
          report.suites.forEach((suite: any) => processSuite(suite));
        }

        console.log('Parsed test statistics:', { passed, failed, skipped, total });
        return { passed, failed, skipped, total };
      }
      
      console.warn('JSON report not found at:', jsonReportPath);
      
      // Fallback to the old logic if JSON report is missing
      return this.getTestStatisticsFallback();
      
    } catch (error) {
      console.warn('Error reading test statistics:', error);
      return undefined;
    }
  }

  /**
   * Fallback method to estimate statistics from directories (less accurate)
   */
  private getTestStatisticsFallback(): { passed: number, failed: number, skipped: number, total: number } | undefined {
    const testResultsPath = path.join(process.cwd(), 'test-results');
    if (!fs.existsSync(testResultsPath)) {
      return undefined;
    }
    
    let passed = 0, failed = 0, skipped = 0, total = 0;
      
    // Read test results directories
    const testDirs = fs.readdirSync(testResultsPath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name);

    testDirs.forEach(testDir => {
      try {
        // Each test directory represents one test execution
        const testDirPath = path.join(testResultsPath, testDir);
        const attachmentsPath = path.join(testDirPath, 'attachments');
        
        // Check if there are attachments that might indicate failures (like error screenshots)
        if (fs.existsSync(attachmentsPath)) {
          const attachments = fs.readdirSync(attachmentsPath);
          // Look for specific failure indicators in attachment names
          const hasFailureIndicators = attachments.some(file => 
            file.toLowerCase().includes('error') || 
            file.toLowerCase().includes('failure') ||
            file.toLowerCase().includes('failed')
          );
          
          if (hasFailureIndicators) {
            failed++;
          } else {
            // Regular screenshots on successful tests
            passed++;
          }
        } else {
          // No attachments - test passed
          passed++;
        }
        total++;
      } catch (error) {
        console.warn(`Error processing test directory ${testDir}:`, error);
      }
    });
    
    return { passed, failed, skipped, total };
  }

  /**
   * Get screenshot files from test results directory
   */
  private getScreenshotFiles(dirPath: string): string[] {
    const files: string[] = [];
    
    const readDir = (dir: string) => {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          readDir(fullPath);
        } else if (item.endsWith('.png') || item.endsWith('.jpg') || item.endsWith('.jpeg')) {
          files.push(fullPath);
        }
      });
    };

    try {
      readDir(dirPath);
    } catch (error) {
      console.warn('Error reading test results directory:', error);
    }

    return files.slice(0, 5); // Limit to 5 screenshots to avoid large emails
  }

  /**
   * Send simple notification email
   */
  public async sendNotification(emailConfig: EmailConfig, smtpConfig: SmtpConfig, message: string, providerConfig?: { provider: string; host: string; port: number; secure: boolean; requiresAppPassword: boolean }): Promise<void> {
    if (!emailConfig.email) {
      return;
    }

    if (!this.transporter) {
      await this.initializeTransporter(smtpConfig, providerConfig);
    }

    const mailOptions = {
      from: smtpConfig.auth.user,
      to: emailConfig.to.join(', '),
      subject: emailConfig.subject,
      html: this.generateEmailBody(message, false)
    };

    try {
      const info = await this.transporter!.sendMail(mailOptions);
      console.log('Notification email sent successfully:', info.messageId);
    } catch (error) {
      console.error('Failed to send notification email:', error);
      throw error;
    }
  }
}

export const emailService = EmailService.getInstance();
