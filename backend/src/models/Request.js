import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    contractor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    materialDetails: { type: String, required: true },
    quantity: { type: Number, required: true },

    // supplier side
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending"
    },
    quotation: {
      price: Number,
      deliveryTime: String,
      terms: String
    },

    // contractor side confirmation
    contractorDecision: {
      type: String,
      enum: ["none", "confirmed", "withdrawn"],
      default: "none"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Request", requestSchema);
