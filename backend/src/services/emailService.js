const nodemailer = require('nodemailer');

// Gmail transporter using app password
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: (process.env.EMAIL_APP_PASSWORD || '').replace(/\s+/g, ''),
  },
});

// Send verification code email
const sendVerificationEmail = async (toEmail, code, userName) => {
  const mailOptions = {
    from: `"FixMate LK" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Verify Your FixMate Account',
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; max-width: 520px; margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
        <div style="background: linear-gradient(135deg, #f97316, #f59e0b); padding: 32px 24px; text-align: center;">
          <h1 style="color: #fff; margin: 0; font-size: 28px; font-weight: 700;">FixMate</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">Your trusted service partner in Sri Lanka</p>
        </div>
        <div style="padding: 32px 24px;">
          <p style="color: #374151; font-size: 16px; margin: 0 0 8px;">Hello <strong>${userName}</strong>,</p>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin: 0 0 24px;">
            Thank you for joining FixMate! Please use the verification code below to complete your registration.
          </p>
          <div style="background: #fef3c7; border: 2px dashed #f59e0b; border-radius: 12px; padding: 20px; text-align: center; margin: 0 0 24px;">
            <p style="color: #92400e; font-size: 12px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 1px;">Verification Code</p>
            <p style="color: #f97316; font-size: 36px; font-weight: 800; margin: 0; letter-spacing: 8px;">${code}</p>
          </div>
          <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
            This code expires in <strong>10 minutes</strong>. If you didn't request this, please ignore this email.
          </p>
        </div>
        <div style="background: #f9fafb; padding: 16px 24px; text-align: center; border-top: 1px solid #f3f4f6;">
          <p style="color: #9ca3af; font-size: 11px; margin: 0;">&copy; 2026 FixMate LK. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };
