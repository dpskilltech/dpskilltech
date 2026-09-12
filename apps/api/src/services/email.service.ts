import nodemailer, { Transporter } from 'nodemailer';
import {
  getWelcomeEmailTemplate,
  getClassReminderEmailTemplate,
  getMockInterviewBookingTemplate,
  getMockScorecardTemplate,
  getTestEmailTemplate
} from './email.templates';

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailDeliveryResult {
  success: boolean;
  messageId: string;
  provider: 'smtp' | 'resend' | 'dev-simulator';
  previewUrl?: string;
  timestamp: string;
  error?: string;
}

class EmailService {
  private transporter: Transporter | null = null;
  private defaultFrom: string;
  private isConfigured: boolean = false;
  private providerName: 'smtp' | 'resend' | 'dev-simulator' = 'dev-simulator';

  constructor() {
    this.defaultFrom =
      process.env.SMTP_FROM || 'DP Skilltech Academy <admissions@dpskilltech.in>';
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const host = process.env.SMTP_HOST;
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const port = Number(process.env.SMTP_PORT) || 587;

    if (host && user && pass) {
      try {
        this.transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: { user, pass }
        });
        this.isConfigured = true;
        this.providerName = 'smtp';
        console.log(`[EmailService] Initialized SMTP Transporter (${host}:${port})`);
      } catch (err) {
        console.error('[EmailService] Failed to initialize SMTP transporter:', err);
        this.transporter = null;
        this.providerName = 'dev-simulator';
      }
    } else {
      this.isConfigured = false;
      this.providerName = 'dev-simulator';
      console.log(
        '[EmailService] No live SMTP credentials found; running in Safe Dev Simulator Mode'
      );
    }
  }

  public getStatus() {
    return {
      isConfigured: this.isConfigured,
      provider: this.providerName,
      defaultFrom: this.defaultFrom
    };
  }

  /**
   * Core dispatch method with automated dev simulation fallback
   */
  public async sendEmail(options: SendEmailOptions): Promise<EmailDeliveryResult> {
    const timestamp = new Date().toISOString();

    // 1. Live SMTP Delivery
    if (this.transporter && this.isConfigured) {
      try {
        const info = await this.transporter.sendMail({
          from: this.defaultFrom,
          to: options.to,
          subject: options.subject,
          html: options.html,
          text: options.text
        });

        const previewUrl = nodemailer.getTestMessageUrl(info) || undefined;

        console.log(`[EmailService] Email sent via SMTP to: ${options.to} (ID: ${info.messageId})`);

        return {
          success: true,
          messageId: info.messageId,
          provider: 'smtp',
          previewUrl,
          timestamp
        };
      } catch (error: any) {
        console.error('[EmailService] SMTP delivery failed:', error);
        return {
          success: false,
          messageId: '',
          provider: 'smtp',
          error: error.message || 'SMTP delivery failed',
          timestamp
        };
      }
    }

    // 2. Safe Dev Simulator Mode (Logs formatted preview, never fails locally)
    const simulatedMessageId = `sim_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    console.log(`\n=============================================================`);
    console.log(`📧 [EMAIL DEV SIMULATOR]`);
    console.log(`To:      ${options.to}`);
    console.log(`From:    ${this.defaultFrom}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`MessageId: ${simulatedMessageId}`);
    console.log(`Timestamp: ${timestamp}`);
    console.log(`-------------------------------------------------------------`);
    console.log(`Preview:`);
    console.log(options.text || options.html.substring(0, 300) + '...');
    console.log(`=============================================================\n`);

    return {
      success: true,
      messageId: simulatedMessageId,
      provider: 'dev-simulator',
      previewUrl: `http://localhost:5000/api/email/preview/${simulatedMessageId}`,
      timestamp
    };
  }

  /**
   * Sends Welcome Email upon Batch Enrollment
   */
  public async sendWelcomeEmail(data: {
    studentName: string;
    email: string;
    courseName: string;
    batchName: string;
    schedule: string;
    zoomUrl: string;
  }): Promise<EmailDeliveryResult> {
    const template = getWelcomeEmailTemplate(data);
    return this.sendEmail({
      to: data.email,
      subject: template.subject,
      html: template.html,
      text: template.text
    });
  }

  /**
   * Sends 30-min Class Reminder with Zoom Deep Link
   */
  public async sendClassReminderEmail(data: {
    studentName: string;
    email: string;
    topic: string;
    instructor: string;
    date: string;
    time: string;
    zoomUrl: string;
    batchName: string;
  }): Promise<EmailDeliveryResult> {
    const template = getClassReminderEmailTemplate(data);
    return this.sendEmail({
      to: data.email,
      subject: template.subject,
      html: template.html,
      text: template.text
    });
  }

  /**
   * Sends 1-on-1 Mock Interview Confirmation
   */
  public async sendMockInterviewBookingEmail(data: {
    studentName: string;
    email: string;
    track: string;
    scheduledAt: string;
    interviewerName: string;
    zoomUrl: string;
  }): Promise<EmailDeliveryResult> {
    const template = getMockInterviewBookingTemplate(data);
    return this.sendEmail({
      to: data.email,
      subject: template.subject,
      html: template.html,
      text: template.text
    });
  }

  /**
   * Sends Mock Interview Rubric Scorecard
   */
  public async sendMockInterviewScorecardEmail(data: {
    studentName: string;
    email: string;
    track: string;
    score: number;
    feedbackNotes: string;
    strengths: string[];
    improvements: string[];
  }): Promise<EmailDeliveryResult> {
    const template = getMockScorecardTemplate(data);
    return this.sendEmail({
      to: data.email,
      subject: template.subject,
      html: template.html,
      text: template.text
    });
  }

  /**
   * Sends Diagnostic Verification Email
   */
  public async sendTestEmail(recipientEmail: string): Promise<EmailDeliveryResult> {
    const timestamp = new Date().toISOString();
    const template = getTestEmailTemplate({
      recipientEmail,
      timestamp
    });
    return this.sendEmail({
      to: recipientEmail,
      subject: template.subject,
      html: template.html,
      text: template.text
    });
  }
}

export const emailService = new EmailService();
