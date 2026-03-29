import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  category: String,
  description: String,
}, { timestamps: true });

export default mongoose.model("Product", productSchema);