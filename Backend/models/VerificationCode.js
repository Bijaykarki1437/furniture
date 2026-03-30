// models/VerificationCode.js
import mongoose from "mongoose";

const verificationCodeSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  code: {
    type: String,
    required: true
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => Date.now() + 10 * 60 * 1000 // 10 minutes
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Auto-delete expired codes
verificationCodeSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.model("VerificationCode", verificationCodeSchema);