import Order from "../models/Order.js";

// ===================== USER ===================== //

// ✅ CREATE ORDER
export const createOrder = async (req, res) => {
  try {
    const { items, total, address, paymentMethod, transactionCode, transactionImage } = req.body;

    const order = await Order.create({
      user: req.user._id,
      items,
      total,
      address,
      paymentMethod,
      esewaPayment: transactionCode
        ? { transactionCode, transactionImage }
        : null,
      paymentStatus: transactionCode ? "awaiting_verification" : "pending",
      status: "pending"
    });

    res.status(201).json({
      message: "Order placed successfully",
      order
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ GET USER ORDERS
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ===================== ADMIN ===================== //

// ✅ GET ALL ORDERS (ADMIN)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE ORDER STATUS (ADMIN)
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ✅ UPDATE PAYMENT STATUS (ADMIN)
export const updatePaymentStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.paymentStatus = req.body.paymentStatus;
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};