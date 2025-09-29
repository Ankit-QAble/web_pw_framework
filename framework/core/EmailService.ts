interface SmtpConfig {
  host: string;
  port: number;
  auth: {
    user: string;
    pass: string;
  };
}

interface EmailConfig {
  to: string[];
  subject: string;
  body: string;
}

export class EmailService {
  private smtpConfig: SmtpConfig;
  private emailConfig: EmailConfig;

  constructor(smtpConfig: SmtpConfig, emailConfig: EmailConfig) {
    this.smtpConfig = smtpConfig;
    this.emailConfig = emailConfig;
  }

  /**
   * Creates a new EmailService instance using environment variables
   * @param config - Email configuration including SMTP and email details
   * @returns EmailService instance
   */
  static createFromConfig(config: { smtpConfig: SmtpConfig; emailConfig: EmailConfig }): EmailService {
    return new EmailService(config.smtpConfig, config.emailConfig);
  }

  /**
   * Configure email settings
   * @param emailConfig - Email configuration settings
   */
  configureEmail(emailConfig: Partial<EmailConfig>): void {
    this.emailConfig = { ...this.emailConfig, ...emailConfig };
  }

  /**
   * Configure SMTP settings
   * @param smtpConfig - SMTP configuration settings
   */
  configureSmtp(smtpConfig: Partial<SmtpConfig>): void {
    this.smtpConfig = { ...this.smtpConfig, ...smtpConfig };
  }

  /**
   * Send email
   * @param options - Optional email options to override defaults
   * @returns Promise<void>
   */
  async sendEmail(options?: Partial<EmailConfig>): Promise<void> {
    const emailData = { ...this.emailConfig, ...options };

    // Implementation for sending email would go here
    console.log('Sending email to:', emailData.to);
    console.log('Subject:', emailData.subject);
    console.log('Body:', emailData.body);
    console.log('SMTP Config:', this.smtpConfig);
    
    // In a real implementation, you would use a library like nodemailer here
    // Example:
    // const transporter = nodemailer.createTransporter(this.smtpConfig);
    // await transporter.sendMail({ ...emailData, from: this.smtpConfig.auth.user });
  }
}

export type { SmtpConfig, EmailConfig };
