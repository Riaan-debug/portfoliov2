import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Security configuration
const SECURITY_CONFIG = {
  maxRequestSize: 1024 * 10, // 10KB max request size
  maxMessageLength: 2000,
  maxNameLength: 100,
  maxEmailLength: 254,
  allowedOrigins: ['http://localhost:3000', 'http://localhost:3001', 'https://riaanvanrhyn.dev', 'https://portfoliov2-kappa-ecru.vercel.app'],
  rateLimit: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  // DoS Protection
  dosProtection: {
    maxConcurrentRequests: 3, // Max concurrent requests per IP
    requestTimeout: 30000, // 30 seconds timeout
    suspiciousPatternThreshold: 3, // Block after 3 suspicious attempts
    globalRateLimit: {
      maxRequests: 100, // Global requests per minute
      windowMs: 60 * 1000, // 1 minute
    }
  }
};

// Advanced rate limiting and DoS protection (in production, use Redis or similar)
const rateLimit = new Map<string, { 
  count: number; 
  resetTime: number; 
  blocked: boolean;
  suspiciousAttempts: number;
  lastRequestTime: number;
  concurrentRequests: number;
}>();

// Global rate limiting
const globalRateLimit = {
  count: 0,
  resetTime: Date.now() + SECURITY_CONFIG.dosProtection.globalRateLimit.windowMs
};

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const userData = rateLimit.get(ip);
  
  if (!userData || now > userData.resetTime) {
    // Reset or create new entry
    rateLimit.set(ip, { 
      count: 1, 
      resetTime: now + SECURITY_CONFIG.rateLimit.windowMs, 
      blocked: false,
      suspiciousAttempts: 0,
      lastRequestTime: now,
      concurrentRequests: 1
    });
    return false;
  }
  
  // Check if IP is blocked
  if (userData.blocked) {
    return true;
  }
  
  // Check concurrent requests
  if (userData.concurrentRequests >= SECURITY_CONFIG.dosProtection.maxConcurrentRequests) {
    return true;
  }
  
  // Check suspicious attempts threshold
  if (userData.suspiciousAttempts >= SECURITY_CONFIG.dosProtection.suspiciousPatternThreshold) {
    userData.blocked = true;
    userData.resetTime = now + (60 * 60 * 1000); // Block for 1 hour
    return true;
  }
  
  if (userData.count >= SECURITY_CONFIG.rateLimit.maxRequests) {
    // Block IP for 1 hour after exceeding rate limit
    userData.blocked = true;
    userData.resetTime = now + (60 * 60 * 1000); // 1 hour
    return true;
  }
  
  userData.count++;
  userData.concurrentRequests++;
  userData.lastRequestTime = now;
  
  // Reset concurrent requests after timeout
  setTimeout(() => {
    const currentData = rateLimit.get(ip);
    if (currentData) {
      currentData.concurrentRequests = Math.max(0, currentData.concurrentRequests - 1);
    }
  }, SECURITY_CONFIG.dosProtection.requestTimeout);
  
  return false;
}

// Enhanced input sanitization
function sanitizeInput(input: string, maxLength: number): string {
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, '') // Remove potential XSS
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/<script/gi, '') // Remove script tags
    .replace(/<\/script/gi, '');
}

// CORS headers
function getCORSHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin = origin && SECURITY_CONFIG.allowedOrigins.includes(origin) 
    ? origin 
    : SECURITY_CONFIG.allowedOrigins[0];
    
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Requested-With',
    'Access-Control-Max-Age': '86400',
  };
}

// Security headers
function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self';"
  };
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      ...getCORSHeaders(null),
      ...getSecurityHeaders(),
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    // DoS Protection: Global rate limiting
    const now = Date.now();
    if (now > globalRateLimit.resetTime) {
      globalRateLimit.count = 1;
      globalRateLimit.resetTime = now + SECURITY_CONFIG.dosProtection.globalRateLimit.windowMs;
    } else {
      globalRateLimit.count++;
      if (globalRateLimit.count > SECURITY_CONFIG.dosProtection.globalRateLimit.maxRequests) {
        console.warn('Global rate limit exceeded - possible DoS attack');
        return NextResponse.json(
          { error: 'Service temporarily unavailable. Please try again later.' },
          { 
            status: 503,
            headers: {
              ...getCORSHeaders(request.headers.get('origin')),
              ...getSecurityHeaders(),
            }
          }
        );
      }
    }

    // Security: Check request size
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > SECURITY_CONFIG.maxRequestSize) {
      return NextResponse.json(
        { error: 'Request too large' },
        { 
          status: 413,
          headers: {
            ...getCORSHeaders(request.headers.get('origin')),
            ...getSecurityHeaders(),
          }
        }
      );
    }

    // Security: Rate limiting
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               request.headers.get('cf-connecting-ip') || 
               'unknown';
               
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { 
          status: 429,
          headers: {
            ...getCORSHeaders(request.headers.get('origin')),
            ...getSecurityHeaders(),
          }
        }
      );
    }

    // Security: Validate Content-Type
    const contentType = request.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { 
          status: 400,
          headers: {
            ...getCORSHeaders(request.headers.get('origin')),
            ...getSecurityHeaders(),
          }
        }
      );
    }

    const body = await request.json();
    const { name, email, message } = body;

    // Enhanced validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { 
          status: 400,
          headers: {
            ...getCORSHeaders(request.headers.get('origin')),
            ...getSecurityHeaders(),
          }
        }
      );
    }

    // Length validation
    if (name.length > SECURITY_CONFIG.maxNameLength || 
        email.length > SECURITY_CONFIG.maxEmailLength || 
        message.length > SECURITY_CONFIG.maxMessageLength) {
      return NextResponse.json(
        { error: 'Input too long. Please check your message length.' },
        { 
          status: 400,
          headers: {
            ...getCORSHeaders(request.headers.get('origin')),
            ...getSecurityHeaders(),
          }
        }
      );
    }

    // Enhanced email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { 
          status: 400,
          headers: {
            ...getCORSHeaders(request.headers.get('origin')),
            ...getSecurityHeaders(),
          }
        }
      );
    }

    // Enhanced sanitization
    const sanitizedName = sanitizeInput(name, SECURITY_CONFIG.maxNameLength);
    const sanitizedEmail = sanitizeInput(email.toLowerCase(), SECURITY_CONFIG.maxEmailLength);
    const sanitizedMessage = sanitizeInput(message, SECURITY_CONFIG.maxMessageLength);

    // Security: Check for suspicious patterns
    const suspiciousPatterns = [
      /eval\s*\(/i,
      /<iframe/i,
      /<object/i,
      /<embed/i,
      /javascript:/i,
      /vbscript:/i,
      /data:text\/html/i,
      /<script/i
    ];

    const allInput = `${sanitizedName} ${sanitizedEmail} ${sanitizedMessage}`;
    if (suspiciousPatterns.some(pattern => pattern.test(allInput))) {
      // Increment suspicious attempts counter
      const userData = rateLimit.get(ip);
      if (userData) {
        userData.suspiciousAttempts++;
        console.warn('Suspicious input detected:', { ip, input: allInput, attempts: userData.suspiciousAttempts });
      }
      
      return NextResponse.json(
        { error: 'Invalid input detected' },
        { 
          status: 400,
          headers: {
            ...getCORSHeaders(request.headers.get('origin')),
            ...getSecurityHeaders(),
          }
        }
      );
    }

    // Send email notification via Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // Send to yourself
      subject: '🎉 New Portfolio Contact Form Submission',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Portfolio Contact!
          </h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>👤 Name:</strong> ${sanitizedName}</p>
            <p><strong>📧 Email:</strong> ${sanitizedEmail}</p>
            <p><strong>💬 Message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #007bff;">
              ${sanitizedMessage.replace(/\n/g, '<br>')}
            </div>
            <p style="margin-top: 15px; font-size: 12px; color: #666;">
              <strong>🌐 IP Address:</strong> ${ip}<br>
              <strong>🕒 Timestamp:</strong> ${new Date().toLocaleString('en-US', { 
                timeZone: 'Africa/Johannesburg',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <p style="color: #666; font-size: 12px;">
            This message was sent from your portfolio contact form at ${new Date().toLocaleDateString()}
          </p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log('Email notification sent successfully');
    } catch (emailError) {
      console.warn('Failed to send email notification:', emailError);
      console.error('Email error details:', {
        name: emailError instanceof Error ? emailError.name : 'Unknown',
        message: emailError instanceof Error ? emailError.message : String(emailError),
        stack: emailError instanceof Error ? emailError.stack : 'No stack trace'
      });
    }

    // Store submission in database (JSON file)
    const submission = {
      id: Date.now().toString(),
      name: sanitizedName,
      email: sanitizedEmail,
      message: sanitizedMessage,
      timestamp: new Date().toISOString(),
      ip,
      userAgent: request.headers.get('user-agent') || 'unknown'
    };

    try {
      const dbPath = path.join(process.cwd(), 'data', 'submissions.json');
      const dbDir = path.dirname(dbPath);
      
      // Create data directory if it doesn't exist
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
      
      // Read existing submissions or create new array
      let submissions = [];
      if (fs.existsSync(dbPath)) {
        const fileContent = fs.readFileSync(dbPath, 'utf-8');
        submissions = JSON.parse(fileContent);
      }
      
      // Add new submission
      submissions.push(submission);
      
      // Write back to file
      fs.writeFileSync(dbPath, JSON.stringify(submissions, null, 2));
      console.log('Submission stored in database successfully');
    } catch (dbError) {
      console.warn('Failed to store submission in database:', dbError);
    }

    // Log to console (sanitized data only)
    console.log('Contact Form Submission:', {
      name: sanitizedName,
      email: sanitizedEmail,
      message: sanitizedMessage,
      timestamp: new Date().toISOString(),
      ip,
      userAgent: request.headers.get('user-agent') || 'unknown'
    });

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Message sent successfully! I\'ll get back to you soon.',
      timestamp: new Date().toISOString()
    }, {
      headers: {
        ...getCORSHeaders(request.headers.get('origin')),
        ...getSecurityHeaders(),
      }
    });

  } catch (error) {
    console.error('Contact form error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        error: 'Something went wrong. Please try again or email me directly.',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
      { 
        status: 500,
        headers: {
          ...getCORSHeaders(request.headers.get('origin')),
          ...getSecurityHeaders(),
        }
      }
    );
  }
}

// Handle other HTTP methods
export async function GET() {
  return NextResponse.json({ 
    message: 'Contact API endpoint',
    rateLimit: {
      maxRequests: SECURITY_CONFIG.rateLimit.maxRequests,
      windowMs: SECURITY_CONFIG.rateLimit.windowMs / 1000 / 60
    }
  }, {
    headers: {
      ...getSecurityHeaders(),
    }
  });
}
