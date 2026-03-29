import express from "express";
import {
  createOrder,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus
} from "../controllers/orderController.js";

import { protect } from "../middleware/authMiddleware.js";
import { admin } from "../middleware/adminMiddleware.js";

const router = express.Router();

// 🧑 USER ROUTES
router.post("/", protect, createOrder);
router.get("/", protect, getUserOrders);

// 🧑‍💼 ADMIN ROUTES (🔐 SECURED)
router.get("/admin", protect, admin, getAllOrders);
router.put("/:id/status", protect, admin, updateOrderStatus);
router.put("/:id/payment", protect, admin, updatePaymentStatus);

export default router;