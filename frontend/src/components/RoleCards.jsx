import { useNavigate } from "react-router-dom";

const RoleCards = () => {
  const navigate = useNavigate();

  return (
    <div className="rb-role-cards">
      <div className="rb-card contractor-card">
        <h3>Contractor / Builder</h3>
        <p>Search materials, compare suppliers and send requests.</p>
        <button
          className="rb-btn-primary"
          onClick={() => navigate("/register?role=contractor")}
        >
          I am a Contractor
        </button>
      </div>
      <div className="rb-card supplier-card">
        <h3>Material Supplier</h3>
        <p>List inventory, manage prices and respond to quotations.</p>
        <button
          className="rb-btn-primary"
          onClick={() => navigate("/register?role=supplier")}
        >
          I am a Supplier
        </button>
      </div>
    </div>
  );
};

export default RoleCards;
