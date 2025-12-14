import mongoose from "mongoose";

const supplierProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    shopName: { type: String, required: true },
    address: { type: String, required: true },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] } // [lng, lat]
    },
    phoneNumber: { type: String, required: true }
  },
  { timestamps: true }
);

supplierProfileSchema.index({ location: "2dsphere" });

export default mongoose.model("SupplierProfile", supplierProfileSchema);
