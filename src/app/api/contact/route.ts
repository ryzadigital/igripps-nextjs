// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { sendContactEmail } from '@/lib/gmail-mailer';

// Type definition for the contact form data
interface ContactFormData {
  name: string;
  email: string;
  message: string;
  subject?: string;
  phone?: string;
  club?: string;
}

export async function POST(req: Request) {
  try {
    console.log('📬 Contact form API called');
    
    const body = await req.json();
    const { name, email, message, subject, phone, club }: ContactFormData = body;

    // Validate required fields
    if (!name || !email || !message) {
      console.log('❌ Missing required fields');
      return NextResponse.json(
        { 
          error: 'Missing required fields', 
          details: 'Name, email, and message are required',
          success: false 
        },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Invalid email format:', email);
      return NextResponse.json(
        { 
          error: 'Invalid email format', 
          details: 'Please provide a valid email address',
          success: false 
        },
        { status: 400 }
      );
    }

    // Validate message length (optional but recommended)
    if (message.length < 10) {
      console.log('❌ Message too short');
      return NextResponse.json(
        { 
          error: 'Message too short', 
          details: 'Message must be at least 10 characters long',
          success: false 
        },
        { status: 400 }
      );
    }

    console.log(`📤 Sending contact email from ${name} (${email})`);

    // Send the email using the updated gmail-mailer
    const result = await sendContactEmail({
      name,
      email,
      message,
      subject,
      phone,
      club
    });

    console.log('✅ Contact email sent successfully:', result.messageId);

    return NextResponse.json({ 
      success: true, 
      messageId: result.messageId,
      message: 'Your message has been sent successfully!'
    });

  } catch (error: any) {
    console.error('❌ Contact form API error:', error.message);
    
    // Log the full error for debugging in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error details:', error);
    }

    // Return different error messages based on the error type
    let errorMessage = 'Failed to send email. Please try again later.';
    let statusCode = 500;

    if (error.message.includes('Service account key')) {
      errorMessage = 'Email service configuration error';
      console.error('💡 Check GOOGLE_SERVICE_ACCOUNT_KEY environment variable');
    } else if (error.message.includes('invalid_grant')) {
      errorMessage = 'Email authentication error';
      console.error('💡 Check domain-wide delegation configuration');
    } else if (error.message.includes('JSON')) {
      errorMessage = 'Email service configuration error';
      console.error('💡 Check if GOOGLE_SERVICE_ACCOUNT_KEY is valid JSON');
    } else if (error.message.includes('Precondition check failed')) {
      errorMessage = 'Email service authentication error';
      console.error('💡 Check service account permissions and domain delegation');
    }

    return NextResponse.json({ 
      error: errorMessage,
      success: false,
      // Only include detailed error in development
      ...(process.env.NODE_ENV === 'development' && { 
        details: error.message 
      })
    }, { status: statusCode });
  }
}

// Optional: Add a GET method for health checks
export async function GET() {
  return NextResponse.json({ 
    status: 'Contact API is running',
    timestamp: new Date().toISOString()
  });
}