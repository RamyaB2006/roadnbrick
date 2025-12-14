import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import Material from "../models/Material.js";
import SupplierProfile from "../models/SupplierProfile.js";
import { haversineDistanceKm } from "../utils/haversine.js";

const router = express.Router();

// POST /api/materials  (supplier creates material)
router.post("/", protect, requireRole("supplier"), async (req, res) => {
  try {
    const supplierProfile = await SupplierProfile.findOne({ user: req.user._id });
    if (!supplierProfile) {
      return res.status(400).json({ message: "Supplier profile not found" });
    }

    const material = await Material.create({
      supplier: supplierProfile._id,
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      unit: req.body.unit,
      stockQuantity: req.body.stockQuantity,
      availabilityStatus: req.body.availabilityStatus,
      currency: "INR"
    });

    res.status(201).json(material);
  } catch (err) {
    console.error("Material create error", err);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/materials  (list all)
router.get("/", protect, async (req, res) => {
  const materials = await Material.find().populate("supplier");
  res.json(materials);
});

// GET /api/materials/search  (contractor search with distance)
router.get("/search", protect, async (req, res) => {
  const { material, category, availability, lat, lng, radiusKm } = req.query;

  const filter = {};
  if (material) filter.name = { $regex: material, $options: "i" };
  if (category) filter.category = category;
  if (availability) filter.availabilityStatus = availability;

  const materials = await Material.find(filter).populate("supplier");
  const latNum = parseFloat(lat);
  const lngNum = parseFloat(lng);
  const radius = parseFloat(radiusKm) || 50;

  const withDistance = materials
    .map((m) => {
      const [sLng, sLat] = m.supplier.location.coordinates;
      const dist = haversineDistanceKm(latNum, lngNum, sLat, sLng);
      return { material: m, distanceKm: dist };
    })
    .filter((x) => x.distanceKm <= radius);

  res.json(withDistance);
});

// PUT /api/materials/:id  (update)
router.put("/:id", protect, requireRole("supplier"), async (req, res) => {
  const updated = await Material.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });
  res.json(updated);
});

// DELETE /api/materials/:id  (delete)
router.delete("/:id", protect, requireRole("supplier"), async (req, res) => {
  await Material.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

export default router;
