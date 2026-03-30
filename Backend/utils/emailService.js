// utils/emailService.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Debug: Log what we have
console.log("📧 Email Configuration Check:");
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✓ Set (length: " + process.env.EMAIL_PASS.length + ")" : "✗ Missing");

// Check if email credentials are configured - FIXED condition
const hasEmailConfig = process.env.EMAIL_USER && process.env.EMAIL_PASS && 
                       process.env.EMAIL_USER !== 'your-email@gmail.com'; // Only skip if it's the placeholder

// Create transporter only if credentials exist
let transporter = null;

if (hasEmailConfig) {
  console.log("✅ Configuring email transporter with Gmail...");
  
  transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    // Add these options for better reliability
    tls: {
      rejectUnauthorized: false
    },
    // Increase timeouts for slower connections
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000
  });

  // Verify transporter configuration
  transporter.verify((error, success) => {
    if (error) {
      console.error("❌ Email transporter error:", error.message);
      console.log("💡 Troubleshooting tips:");
      console.log("   1. Make sure 2FA is enabled on your Gmail account");
      console.log("   2. Generate a NEW App Password from Google Account");
      console.log("   3. Check if your Gmail password is correct");
      console.log("   4. Try using an App Password instead of regular password");
    } else {
      console.log("✅ Email server is ready to send messages");
      console.log(`   Sending from: ${process.env.EMAIL_USER}`);
    }
  });
} else {
  console.warn("⚠️ Email credentials not configured. Using console logging instead.");
  console.log("   To enable email, add to .env file:");
  console.log("   EMAIL_USER=your-email@gmail.com");
  console.log("   EMAIL_PASS=your-app-password");
}

export const sendVerificationEmail = async (email, code) => {
  // If email is not configured, log the code for development
  if (!hasEmailConfig || !transporter) {
    console.log(`\n📧 [DEV MODE] VERIFICATION CODE for ${email}: ${code}\n`);
    return { success: true, devMode: true };
  }

  const mailOptions = {
    from: `"Furniture Store" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Furniture Store Account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="background: #8B7355; width: 60px; height: 60px; border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
            <span style="font-size: 30px;">🪑</span>
          </div>
          <h1 style="color: #8B7355; margin: 0;">Furniture Store</h1>
          <h2 style="color: #333; margin: 10px 0 0;">Verify Your Email Address</h2>
        </div>
        
        <p style="font-size: 16px;">Hello,</p>
        <p style="font-size: 16px;">Thank you for signing up! Please use the verification code below to complete your registration:</p>
        
        <div style="background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%); padding: 25px; text-align: center; margin: 25px 0; border-radius: 12px; border: 1px solid #d0d0d0;">
          <h1 style="font-size: 48px; letter-spacing: 10px; color: #8B7355; font-weight: bold; margin: 0; font-family: monospace;">${code}</h1>
        </div>
        
        <div style="background: #fff3e0; padding: 12px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <p style="margin: 0; font-size: 14px; color: #8B7355;">
            ⏰ This code will expire in <strong>10 minutes</strong>
          </p>
        </div>
        
        <p style="font-size: 14px; color: #666;">If you didn't create an account, you can safely ignore this email.</p>
        
        <hr style="margin: 25px 0; border: none; border-top: 1px solid #e0e0e0;">
        
        <p style="color: #999; font-size: 12px; text-align: center;">
          This is an automated message, please do not reply.<br>
          © 2024 Furniture Store. All rights reserved.
        </p>
      </div>
    `,
    text: `Your verification code for Furniture Store is: ${code}\n\nThis code will expire in 10 minutes.\n\nIf you didn't create an account, please ignore this email.`
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Verification email sent to ${email}`);
    console.log(`   Message ID: ${info.messageId}`);
    return { success: true };
  } catch (error) {
    console.error("❌ Failed to send verification email:", error.message);
    console.log(`   To: ${email}`);
    console.log(`   Code: ${code} (for manual verification)`);
    return { success: false, error: error.message, code };
  }
};

// For development, you can use this to show code in console
export const logVerificationCode = (email, code) => {
  console.log(`
╔═══════════════════════════════════════════════════════════════════════════╗
║                         🔐 VERIFICATION CODE                              ║
╠═══════════════════════════════════════════════════════════════════════════╣
║  Email: ${email.padEnd(50)}║
║  Code:  ${code.padEnd(50)}║
╠═══════════════════════════════════════════════════════════════════════════╣
║  Use this code to verify your account. It expires in 10 minutes.        ║
╚═══════════════════════════════════════════════════════════════════════════╝
  `);
};