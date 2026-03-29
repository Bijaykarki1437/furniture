import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// 🔑 Generate Token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// ✅ SIGNUP
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ FIXED: Check if this email should be admin
    // Use your actual admin email here
    const adminEmails = ["admin@furniture.com", "fakeeacc515@gmail.com"]; // Add your admin emails here
    const isAdmin = adminEmails.includes(email);
    
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: isAdmin ? "admin" : "user"
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

// ✅ LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email" });

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
    // ✅ Make sure to return the user object with role
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