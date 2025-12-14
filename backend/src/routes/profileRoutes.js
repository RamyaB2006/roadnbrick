// backend/src/routes/profileRoutes.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import ContractorProfile from "../models/ContractorProfile.js";
import SupplierProfile from "../models/SupplierProfile.js";

const router = express.Router();

/* ---------------- Contractor profile ---------------- */

router.get(
  "/contractor/me",
  protect,
  requireRole("contractor"),
  async (req, res) => {
    const profile = await ContractorProfile.findOne({ user: req.user._id });
    res.json(profile);
  }
);

router.put(
  "/contractor/me",
  protect,
  requireRole("contractor"),
  async (req, res) => {
    const { locationsServed, preferredMaterials } = req.body;

    const profile = await ContractorProfile.findOneAndUpdate(
      { user: req.user._id },
      { locationsServed, preferredMaterials },
      { new: true, upsert: true }
    );

    res.json(profile);
  }
);

/* ---------------- Supplier profile ---------------- */

router.get(
  "/supplier/me",
  protect,
  requireRole("supplier"),
  async (req, res) => {
    const profile = await SupplierProfile.findOne({ user: req.user._id });
    res.json(profile);
  }
);

router.put(
  "/supplier/me",
  protect,
  requireRole("supplier"),
  async (req, res) => {
    const { shopName, address, phoneNumber, lat, lng } = req.body;

    const update = {
      shopName,
      address,
      phoneNumber
    };

    // Only update location if coordinates are provided
    if (lat !== undefined && lng !== undefined) {
      update.location = { type: "Point", coordinates: [lng, lat] };
    }

    const profile = await SupplierProfile.findOneAndUpdate(
      { user: req.user._id },
      update,
      { new: true, upsert: true }
    );

    res.json(profile);
  }
);

export default router;
