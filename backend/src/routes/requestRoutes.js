import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { requireRole } from "../middleware/roleMiddleware.js";
import Request from "../models/Request.js";

const router = express.Router();

/* -------- Contractor creates request -------- */
// POST /api/requests
router.post("/", protect, requireRole("contractor"), async (req, res) => {
  try {
    const { supplierId, materialDetails, quantity } = req.body;

    if (!supplierId || !materialDetails || !quantity) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const request = await Request.create({
      contractor: req.user._id,
      supplier: supplierId,
      materialDetails,
      quantity
    });

    res.status(201).json(request);
  } catch (err) {
    console.error("Request create error", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* -------- Both roles see their own requests -------- */
// GET /api/requests/mine
router.get("/mine", protect, async (req, res) => {
  try {
    const filter =
      req.user.role === "contractor"
        ? { contractor: req.user._id }
        : { supplier: req.user._id };

    const requests = await Request.find(filter)
      .populate("contractor", "name email")
      .populate("supplier", "name email");

    res.json(requests);
  } catch (err) {
    console.error("Request list error", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* -------- Supplier responds (accept / reject + quote) -------- */
// PUT /api/requests/:id/respond
router.put(
  "/:id/respond",
  protect,
  requireRole("supplier"),
  async (req, res) => {
    try {
      const { status, price, deliveryTime, terms } = req.body;

      const request = await Request.findById(req.params.id);
      if (!request) return res.status(404).json({ message: "Not found" });

      if (request.supplier.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not your request" });
      }

      if (status) request.status = status;
      request.quotation = {
        price,
        deliveryTime,
        terms
      };
      await request.save();

      res.json(request);
    } catch (err) {
      console.error("Request respond error", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

/* -------- Contractor confirms or withdraws -------- */
// PUT /api/requests/:id/decision
router.put(
  "/:id/decision",
  protect,
  requireRole("contractor"),
  async (req, res) => {
    try {
      const { decision } = req.body; // "confirmed" or "withdrawn"

      if (!["confirmed", "withdrawn"].includes(decision)) {
        return res
          .status(400)
          .json({ message: "decision must be confirmed or withdrawn" });
      }

      const request = await Request.findById(req.params.id);
      if (!request) return res.status(404).json({ message: "Not found" });

      if (request.contractor.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Not your request" });
      }

      request.contractorDecision = decision;

      // if confirmed and supplier accepted, mark completed
      if (decision === "confirmed" && request.status === "accepted") {
        request.status = "completed";
      }

      await request.save();
      res.json(request);
    } catch (err) {
      console.error("Decision error", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
