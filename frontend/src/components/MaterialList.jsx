import "../styles/dashboard.css";

const MaterialList = ({ materials, onRequest }) => {
  return (
    <div className="rb-material-list">
      {materials.map((m) => (
        <div key={m._id} className="rb-card material-card">
          <h3>{m.name}</h3>
          <p className="rb-chip">{m.category}</p>
          <p>
            ₹{m.price} / {m.unit}
          </p>
          <p>Stock: {m.stockQuantity}</p>
          <p>Supplier: {m.supplier.shopName}</p>
          <p>Phone: {m.supplier.phoneNumber}</p>
          {m.distanceKm && <p>Distance: {m.distanceKm.toFixed(1)} km</p>}
          <button
            className="rb-btn-primary rb-btn-full"
            onClick={() => onRequest(m)}
          >
            Request / Quotation
          </button>
        </div>
      ))}
    </div>
  );
};

export default MaterialList;
