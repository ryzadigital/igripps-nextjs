const { google } = require('googleapis');

class GmailServiceAccountMailer {
  constructor(serviceAccountKey, impersonateEmail = 'ryan@ryza.digital') {
    this.serviceAccountKey = serviceAccountKey;
    this.impersonateEmail = impersonateEmail;
    this.gmail = null;
  }

  async initialize() {
    try {
      console.log('🔑 Initializing Gmail API with service account...');

      // Parse the service account key if it's a string
      const keyData = typeof this.serviceAccountKey === 'string' 
        ? JSON.parse(this.serviceAccountKey) 
        : this.serviceAccountKey;

      // Use JWT auth like the working test script
      const auth = new google.auth.JWT({
        email: keyData.client_email,
        key: keyData.private_key,
        scopes: ['https://www.googleapis.com/auth/gmail.send'],
        subject: this.impersonateEmail, // The impersonated user
      });

      this.gmail = google.gmail({ version: 'v1', auth });

      console.log('✅ Gmail API initialized successfully');
      console.log(`📧 Impersonating: ${this.impersonateEmail}`);
    } catch (error) {
      console.error('❌ Failed to initialize Gmail API:', error.message);
      
      // Add more specific error information
      if (error.message.includes('invalid_grant')) {
        console.error('💡 Hint: Check if domain-wide delegation is properly configured');
      }
      if (error.message.includes('JSON')) {
        console.error('💡 Hint: Check if GOOGLE_SERVICE_ACCOUNT_KEY is valid JSON');
      }
      
      throw error;
    }
  }

  createEmailMessage({ to, subject, textContent, from = null, bcc = null }) {
    const fromAddress = from || this.impersonateEmail;

    // Use the same format as the working test script
    const emailHeaders = [
      `To: ${to}`,
      `From: ${fromAddress}`,
      `Subject: ${subject}`,
    ];

    // Add BCC header if provided
    if (bcc) {
      emailHeaders.push(`Bcc: ${bcc}`);
    }

    const emailContent = [
      ...emailHeaders,
      'Content-Type: text/plain; charset="UTF-8"',
      '',
      textContent
    ].join('\n'); // Use \n instead of \r\n

    return Buffer.from(emailContent)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  formatContactFormEmail({ name, email, club, phone, message, subject = 'New Contact Form Submission' }) {
    const timestamp = new Date().toLocaleString('en-AU', {
      timeZone: 'Australia/Sydney',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    return `
NEW CONTACT FORM SUBMISSION
===========================

Received: ${timestamp}
Subject: ${subject}

CONTACT DETAILS:
----------------
Name:  ${name}
Email: ${email}
Club:  ${club || 'N/A'}
Phone: ${phone || 'N/A'}

MESSAGE:
--------
${message}

---
This message was sent from the iGripps contact form.
Reply directly to this email to respond to ${name} at ${email}.
`.trim();
  }

  formatConfirmationEmail({ name, subject = 'General Inquiry' }) {
    const timestamp = new Date().toLocaleString('en-AU', {
      timeZone: 'Australia/Sydney',
      dateStyle: 'full',
      timeStyle: 'medium',
    });

    return `
Hi ${name},

Thanks for contacting iGripps! We've received your ${subject.toLowerCase()} submission and will get back to you as soon as possible.

SUBMISSION DETAILS:
-------------------
Received: ${timestamp}
Type: ${subject}

Our team will review your message and respond as soon as possible. If you have any urgent questions, feel free to call us directly.

Best regards,
The iGripps Team

---
iGripps - Premium Football Socks
Website: https://igripps.com.au
Email: admin@igripps.com.au 

This is an automated confirmation email. Please do not reply to this message.
`.trim();
  }

  async sendEmail({ to, subject, textContent, from = null, bcc = null }) {
    try {
      if (!this.gmail) throw new Error('Gmail API not initialized. Call initialize() first.');

      console.log(`📤 Sending email to: ${to}`);
      if (bcc) console.log(`📋 BCC: ${bcc}`);
      console.log(`📝 Subject: ${subject}`);

      const encodedMessage = this.createEmailMessage({
        to,
        subject,
        textContent,
        from,
        bcc,
      });

      const response = await this.gmail.users.messages.send({
        userId: 'me',
        requestBody: { raw: encodedMessage },
      });

      console.log('✅ Email sent successfully');
      console.log(`📬 Message ID: ${response.data.id}`);

      return {
        success: true,
        messageId: response.data.id,
        threadId: response.data.threadId,
      };
    } catch (error) {
      console.error('❌ Failed to send email:', error.message);
      throw error;
    }
  }

  async sendContactEmail(contactData, recipientEmail = 'ryanselvage@outlook.com', bccEmail = null) {
    try {
      console.log('🚀 Processing contact form submission...');

      const { name, email, message, subject } = contactData;
      if (!name || !email || !message) {
        throw new Error('Missing required fields: name, email, and message are required');
      }

      if (!this.gmail) await this.initialize();

      // Email 1: Send notification to business
      const businessSubject = `iGripps Forms: Submission from ${email}`;
      const businessContent = this.formatContactFormEmail(contactData);

      console.log('📧 Sending business notification...');
      const businessResult = await this.sendEmail({
        to: recipientEmail,
        subject: businessSubject,
        textContent: businessContent,
        from: null,
        bcc: bccEmail,
      });

      // Email 2: Send confirmation to submitter
      const subjectLabels = {
        'general': 'General Inquiry',
        'quote': 'Quote Request',
        'sample': 'Sample Request',
        'bulk': 'Bulk Order Inquiry',
        'support': 'Customer Support',
        'partnership': 'Partnership Inquiry'
      };

      const confirmationSubject = `iGripps - Thank you for your ${subjectLabels[subject] || 'inquiry'}`;
      const confirmationContent = this.formatConfirmationEmail({
        name,
        subject: subjectLabels[subject] || subject
      });

      console.log('📬 Sending confirmation to submitter...');
      const confirmationResult = await this.sendEmail({
        to: email,
        subject: confirmationSubject,
        textContent: confirmationContent,
        from: null,
      });

      console.log('🎉 Both emails sent successfully');
      return {
        success: true,
        businessEmail: businessResult,
        confirmationEmail: confirmationResult,
      };
    } catch (error) {
      console.error('💥 Error sending contact form email:', error.message);

      if (error.response?.data) {
        console.error('📋 API Error Details:', JSON.stringify(error.response.data, null, 2));
      }

      throw error;
    }
  }
}

async function sendContactEmail(
  contactData,
  serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
  recipientEmail = 'ryanselvage@outlook.com',
  impersonateEmail = 'ryan@ryza.digital',
  bccEmail = null
) {
  // Validate that the service account key is provided
  if (!serviceAccountKey) {
    throw new Error('Service account key is required. Please set the GOOGLE_SERVICE_ACCOUNT_KEY environment variable.');
  }

  const mailer = new GmailServiceAccountMailer(serviceAccountKey, impersonateEmail);
  await mailer.initialize();
  return await mailer.sendContactEmail(contactData, recipientEmail, bccEmail);
}

module.exports = {
  GmailServiceAccountMailer,
  sendContactEmail,
};