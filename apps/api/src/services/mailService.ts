import nodemailer from 'nodemailer';

export interface SendMailOptions {
  to: string;
  subject: string;
  name: string;
  otp: string;
}

export const sendVerificationEmail = async (options: SendMailOptions): Promise<boolean> => {
  const { to, subject, name, otp } = options;

  const textContent = `Hello ${name},

Thank you for registering.

Your email verification code is:

${otp}

This code will expire in 10 minutes.

If you did not create this account, you can safely ignore this email.

Regards,
Voice-RAG Team`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #4F46E5; text-align: center;">Verify Your Email Address</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>Thank you for registering on Saksham AI.</p>
      <p>Your email verification code is:</p>
      <div style="text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1F2937; background-color: #F3F4F6; padding: 10px 20px; border-radius: 4px; border: 1px dashed #4F46E5;">
          ${otp}
        </span>
      </div>
      <p>This code will expire in <strong>10 minutes</strong>.</p>
      <p style="color: #6B7280; font-size: 14px;">If you did not create this account, you can safely ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
      <p style="font-size: 14px; color: #4B5563;">Regards,<br /><strong>Voice-RAG Team</strong></p>
    </div>
  `;

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT) || 587;
  const username = process.env.SMTP_USERNAME;
  const password = process.env.SMTP_PASSWORD;
  const fromEmail = process.env.SMTP_FROM_EMAIL || 'no-reply@saksham.ai';

  // Check if SMTP is configured
  if (!host || !username || !password) {
    if (process.env.NODE_ENV !== 'production') {
      console.log('\n-----------------------------------------');
      console.log('📬 [SMTP Fallback] Verification Email Sent:');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log(`OTP Code: ${otp}`);
      console.log('-----------------------------------------\n');
      return true;
    }
    console.error('❌ SMTP credentials not configured in production environment.');
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: {
        user: username,
        pass: password,
      },
    });

    await transporter.sendMail({
      from: `"Voice-RAG Team" <${fromEmail}>`,
      to,
      subject,
      text: textContent,
      html: htmlContent,
    });

    return true;
  } catch (error: any) {
    console.error('❌ Failed to send verification email via SMTP:', error.message);
    
    // Developer helper fallback in development/test
    if (process.env.NODE_ENV !== 'production') {
      console.log('\n⚠️ [SMTP Error Fallback] logging OTP to console:');
      console.log(`To: ${to}, OTP: ${otp}\n`);
      return true;
    }
    return false;
  }
};
