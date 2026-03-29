import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
    }
  ],

  total: Number,

  address: {
    fullName: String,
    email: String,
    phone: String,
    province: String,
    district: String,
    municipality: String,
    wardNo: String,
    tole: String,
    deliveryNote: String
  },

  paymentMethod: String,

  // 🔥 ADD THIS
  transactionCode: {
    type: String,
    default: null
  },

  paymentStatus: {
    type: String,
    default: "pending"
  },

  status: {
    type: String,
    default: "pending"
  }

}, { timestamps: true });

export default mongoose.model("Order", orderSchema);