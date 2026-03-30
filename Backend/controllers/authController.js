// controllers/authController.js
import User from "../models/User.js";
import VerificationCode from "../models/VerificationCode.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "../utils/emailService.js";

// 🔑 Generate Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ✅ SEND VERIFICATION CODE
export const sendVerificationCode = async (req, res) => {
  const { email } = req.body;

  try {
    // Check if user already exists and is verified
    const existingUser = await User.findOne({ email });
    if (existingUser && existingUser.isVerified) {
      return res.status(400).json({ message: "Email already registered and verified" });
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Save or update verification code
    await VerificationCode.findOneAndUpdate(
      { email },
      { code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
      { upsert: true, new: true }
    );
    
    // Send email
    await sendVerificationEmail(email, code);
    
    res.json({ 
      success: true, 
      message: "Verification code sent to your email",
      email 
    });
    
  } catch (err) {
    console.error("Send verification error:", err);
    res.status(500).json({ message: "Failed to send verification code" });
  }
};

// ✅ VERIFY CODE
export const verifyCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    const verification = await VerificationCode.findOne({ email, code });
    
    if (!verification) {
      return res.status(400).json({ message: "Invalid verification code" });
    }
    
    if (verification.expiresAt < new Date()) {
      await VerificationCode.deleteOne({ email });
      return res.status(400).json({ message: "Verification code expired. Please request a new one." });
    }
    
    // Delete used verification code
    await VerificationCode.deleteOne({ email });
    
    res.json({ success: true, message: "Code verified successfully" });
    
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ SIGNUP (with verification)
export const signup = async (req, res) => {
  const { name, email, password, verified } = req.body;

  try {
    if (!verified) {
      return res.status(400).json({ message: "Email not verified" });
    }
    
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Check if this email should be admin
    const adminEmails = ["admin@furniture.com", "fakeeacc515@gmail.com"];
    const isAdmin = adminEmails.includes(email);
    
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: isAdmin ? "admin" : "user",
      isVerified: true
    });

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role 
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ LOGIN (check verification)
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });
    
    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email first" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    const token = generateToken(user._id);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET CURRENT USER
export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    res.json({
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ RESEND VERIFICATION CODE
export const resendVerificationCode = async (req, res) => {
  const { email } = req.body;

  try {
    // Generate new code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Update verification code
    await VerificationCode.findOneAndUpdate(
      { email },
      { code, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
      { upsert: true, new: true }
    );
    
    // Send email
    await sendVerificationEmail(email, code);
    
    res.json({ 
      success: true, 
      message: "New verification code sent to your email"
    });
    
  } catch (err) {
    console.error("Resend verification error:", err);
    res.status(500).json({ message: "Failed to send verification code" });
  }
};