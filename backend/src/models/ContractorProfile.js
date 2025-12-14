import mongoose from "mongoose";

const contractorProfileSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    locationsServed: [{ type: String }],
    preferredMaterials: [{ type: String }]
  },
  { timestamps: true }
);

export default mongoose.model("ContractorProfile", contractorProfileSchema);
