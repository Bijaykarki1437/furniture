// routes/authRoutes.js
import express from "express";
import { 
  signup, 
  login, 
  getMe,
  sendVerificationCode,
  verifyCode,
  resendVerificationCode
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send-verification", sendVerificationCode);
router.post("/verify-code", verifyCode);
router.post("/resend-verification", resendVerificationCode);
router.post("/signup", signup);
router.post("/login", login);
router.get("/me", protect, getMe);

export default router;