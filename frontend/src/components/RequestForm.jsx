import { useState } from "react";
import "../styles/dashboard.css";

const RequestForm = ({ selectedMaterial, onSubmit, onClose }) => {
  const [quantity, setQuantity] = useState("");
  const [details, setDetails] = useState("");

  if (!selectedMaterial) return null;

  const handleSubmit = (e) => {
    e.preventDefault();

    const supplierUserId =
      selectedMaterial.supplier.user || selectedMaterial.supplier._id;

    onSubmit({
      supplierId: supplierUserId,
      materialDetails:
        details ||
        `${selectedMaterial.name} - ${selectedMaterial.category}`,
      quantity: Number(quantity)
    });
  };

  return (
    <div className="rb-modal-overlay">
      <div className="rb-modal">
        <h3>Request / Quotation</h3>
        <p>
          Supplier: <strong>{selectedMaterial.supplier.shopName}</strong>
        </p>
        <form onSubmit={handleSubmit} className="rb-modal-form">
          <label>Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
          <label>Details</label>
          <textarea
            rows="3"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Describe your requirement"
          />
          <div className="rb-modal-actions">
            <button
              type="button"
              onClick={onClose}
              className="rb-btn-secondary"
            >
              Cancel
            </button>
            <button type="submit" className="rb-btn-primary">
              Send Request
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestForm;
