import { NextRequest, NextResponse } from 'next/server';

// Security configuration
const SECURITY_CONFIG = {
  maxRequestSize: 1024 * 10, // 10KB max request size
  maxMessageLength: 2000,
  maxNameLength: 100,
  maxEmailLength: 254,
  allowedOrigins: ['http://localhost:3000', 'http://localhost:3001', 'https://riaanvanrhyn.dev'],
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
    'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://discord.com;"
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

    // Send notification to Discord (using environment variable)
    const discordWebhookUrl = process.env.DISCORD_WEBHOOK_URL || 
      'https://discord.com/api/webhooks/1406596670187372695/qRad42Y2Z6I5KZ96sPfn3j7CL-MNAWK7TY7Ccj7rGTfu3jWrE6';
    
    const discordPayload = {
      embeds: [{
        title: '🎉 New Portfolio Contact!',
        color: 0x00ff00,
        fields: [
          {
            name: '👤 Name',
            value: sanitizedName,
            inline: true
          },
          {
            name: '📧 Email',
            value: sanitizedEmail,
            inline: true
          },
          {
            name: '💬 Message',
            value: sanitizedMessage.length > 1024 ? sanitizedMessage.substring(0, 1021) + '...' : sanitizedMessage,
            inline: false
          },
          {
            name: '🌐 IP Address',
            value: ip,
            inline: true
          },
          {
            name: '🕒 Timestamp',
            value: new Date().toLocaleString('en-US', { 
              timeZone: 'Africa/Johannesburg',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            }),
            inline: true
          }
        ],
        footer: {
          text: 'Portfolio Contact Form'
        },
        timestamp: new Date().toISOString()
      }]
    };

    try {
      const discordResponse = await fetch(discordWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(discordPayload),
      });

      if (!discordResponse.ok) {
        console.warn('Discord notification failed:', await discordResponse.text());
      } else {
        console.log('Discord notification sent successfully');
      }
    } catch (discordError) {
      console.warn('Failed to send Discord notification:', discordError);
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
