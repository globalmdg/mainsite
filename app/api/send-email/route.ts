// app/api/send-email/route.ts (for App Router)
// or pages/api/send-email.ts (for Pages Router - adjust export format)

import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Types for the email request
interface EmailRequest {
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  from?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: Array<{
    filename: string;
    content: string | Buffer;
    contentType?: string;
  }>;
}

// Validate email format
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate email array
const validateEmails = (emails: string | string[]): boolean => {
  if (typeof emails === 'string') {
    return validateEmail(emails);
  }
  if (Array.isArray(emails)) {
    return emails.every(email => validateEmail(email));
  }
  return false;
};

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body: EmailRequest = await request.json();
    const { to, subject, text, html, from, cc, bcc, attachments } = body;

    // Validate required fields
    if (!to || !subject) {
      return NextResponse.json(
        { error: 'Missing required fields: to and subject are required' },
        { status: 400 }
      );
    }

    // Validate email addresses
    if (!validateEmails(to)) {
      return NextResponse.json(
        { error: 'Invalid email address in "to" field' },
        { status: 400 }
      );
    }

    if (cc && !validateEmails(cc)) {
      return NextResponse.json(
        { error: 'Invalid email address in "cc" field' },
        { status: 400 }
      );
    }

    if (bcc && !validateEmails(bcc)) {
      return NextResponse.json(
        { error: 'Invalid email address in "bcc" field' },
        { status: 400 }
      );
    }

    // Validate that either text or html content is provided
    if (!text && !html) {
      return NextResponse.json(
        { error: 'Either text or html content must be provided' },
        { status: 400 }
      );
    }

    // Check for required environment variables
    const brevoApiKey = process.env.BREVO_API_KEY;
    const brevoLoginEmail = process.env.BREVO_LOGIN_EMAIL;
    const defaultFromEmail = process.env.DEFAULT_FROM_EMAIL;

    if (!brevoApiKey || !brevoLoginEmail) {
      console.error('Missing Brevo credentials in environment variables');
      return NextResponse.json(
        { error: 'Email service configuration error' },
        { status: 500 }
      );
    }

    // Create Nodemailer transporter with Brevo SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: brevoLoginEmail, // Your Brevo login email
        pass: brevoApiKey, // Your Brevo SMTP key
      },
      // Optional: Add additional security options
      tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false,
      },
    });

    // Verify SMTP connection (optional but recommended)
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError);
      return NextResponse.json(
        { error: 'Email service connection failed' },
        { status: 500 }
      );
    }

    // Prepare email options
    const mailOptions = {
      from: from || defaultFromEmail || 'noreply@yourdomain.com',
      to: Array.isArray(to) ? to.join(', ') : to,
      cc: cc ? (Array.isArray(cc) ? cc.join(', ') : cc) : undefined,
      bcc: bcc ? (Array.isArray(bcc) ? bcc.join(', ') : bcc) : undefined,
      subject,
      text,
      html,
      attachments,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent successfully:', {
      messageId: info.messageId,
      to: mailOptions.to,
      subject: mailOptions.subject,
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Email sent successfully',
        messageId: info.messageId,
        accepted: info.accepted,
        rejected: info.rejected,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending email:', error);

    // Handle specific error types
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    // Handle Nodemailer/SMTP errors
    if (error && typeof error === 'object' && 'code' in error) {
      const smtpError = error as { code: string; response?: string };

      switch (smtpError.code) {
        case 'EAUTH':
          return NextResponse.json(
            { error: 'Authentication failed - check your Brevo credentials' },
            { status: 401 }
          );
        case 'ECONNECTION':
          return NextResponse.json(
            { error: 'Connection failed - check your network and Brevo service status' },
            { status: 502 }
          );
        default:
          return NextResponse.json(
            {
              error: 'Email sending failed',
              details: smtpError.response || smtpError.code
            },
            { status: 500 }
          );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error while sending email' },
      { status: 500 }
    );
  }
}

// Optional: Add GET method for testing
export async function GET() {
  return NextResponse.json(
    { message: 'Email API endpoint is working' },
    { status: 200 }
  );
}