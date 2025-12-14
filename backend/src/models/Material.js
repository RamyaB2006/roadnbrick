import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "SupplierProfile", required: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: String, required: true },
    stockQuantity: { type: Number, default: 0 },
    availabilityStatus: { type: String, enum: ["available", "unavailable"], default: "available" },
    currency: { type: String, default: "INR" }
  },
  { timestamps: true }
);

export default mongoose.model("Material", materialSchema);
