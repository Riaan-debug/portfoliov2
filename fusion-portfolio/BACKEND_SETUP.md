# Backend Setup & Configuration

## 🚀 Current Implementation

Your contact form now has a working backend with:

- **API Endpoint**: `/api/contact`
- **Form Validation**: Client and server-side validation
- **Rate Limiting**: 5 requests per 15 minutes per IP
- **Input Sanitization**: Basic XSS protection
- **Error Handling**: Comprehensive error responses
- **Logging**: Console logging for debugging

## 📧 Next Steps: Email Integration

### Option 1: SendGrid (Recommended)
```bash
npm install @sendgrid/mail
```

Create `.env.local`:
```env
SENDGRID_API_KEY=your_api_key_here
SENDGRID_FROM_EMAIL=your-email@domain.com
SENDGRID_TO_EMAIL=your-email@domain.com
```

### Option 2: Resend
```bash
npm install resend
```

Create `.env.local`:
```env
RESEND_API_KEY=your_api_key_here
RESEND_FROM_EMAIL=your-email@domain.com
RESEND_TO_EMAIL=your-email@domain.com
```

### Option 3: Nodemailer (Gmail)
```bash
npm install nodemailer
```

Create `.env.local`:
```env
GMAIL_USER=your-email@gmail.com
GMAIL_APP_PASSWORD=your_app_password_here
```

## 🗄️ Database Integration

### MongoDB
```bash
npm install mongodb
```

### PostgreSQL
```bash
npm install @prisma/client prisma
```

## 🔒 Security Features

- Rate limiting per IP address
- Input sanitization
- CORS protection
- Request size limits
- Error message sanitization

## 🧪 Testing

Test your API endpoint:
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","message":"Hello!"}'
```

## 📊 Monitoring

Check the browser console and server logs for:
- Form submissions
- Rate limiting
- Errors
- Performance metrics

## 🚀 Deployment

When deploying to Vercel/Netlify:
1. Set environment variables in your hosting platform
2. The API route will automatically work
3. Consider adding monitoring and analytics
