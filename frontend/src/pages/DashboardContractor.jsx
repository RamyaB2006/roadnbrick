import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import MaterialList from "../components/MaterialList.jsx";
import RequestForm from "../components/RequestForm.jsx";
import "../styles/dashboard.css";

const DashboardContractor = () => {
  const [materials, setMaterials] = useState([]);
  const [query, setQuery] = useState("");
  const [loadingMaterials, setLoadingMaterials] = useState(false);

  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const [myRequests, setMyRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // ---------- load materials (simple, no map / radius) ----------

  const fetchMaterials = async () => {
    setLoadingMaterials(true);
    try {
      const { data } = await axiosClient.get("/materials");
      setMaterials(data);
    } catch (err) {
      console.error("Materials load error", err);
      alert(err.response?.data?.message || "Failed to load materials");
    } finally {
      setLoadingMaterials(false);
    }
  };

  const searchMaterials = async () => {
    setLoadingMaterials(true);
    try {
      const { data } = await axiosClient.get("/materials", {
        params: { material: query }
      });
      setMaterials(data);
    } catch (err) {
      console.error("Search error", err);
      alert(err.response?.data?.message || "Search failed");
    } finally {
      setLoadingMaterials(false);
    }
  };

  // ---------- load my requests ----------

  const fetchMyRequests = async () => {
    setLoadingRequests(true);
    try {
      const { data } = await axiosClient.get("/requests/mine");
      setMyRequests(data);
    } catch (err) {
      console.error("Load requests error", err);
      alert(err.response?.data?.message || "Failed to load requests");
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
    fetchMyRequests();
  }, []);

  // ---------- send request ----------

  const handleRequestSubmit = async (payload) => {
    try {
      await axiosClient.post("/requests", payload);
      alert("Request sent");
      setSelectedMaterial(null);
      await fetchMyRequests();
    } catch (err) {
      console.error("Request send error", err);
      alert(err.response?.data?.message || "Failed to send request");
    }
  };

  // ---------- contractor decision (confirm / withdraw) ----------

  const handleDecision = async (requestId, decision) => {
    try {
      await axiosClient.put(`/requests/${requestId}/decision`, { decision });
      await fetchMyRequests();
      alert(
        decision === "confirmed"
          ? "Request confirmed"
          : "Request withdrawn / cancelled"
      );
    } catch (err) {
      console.error("Decision error", err);
      alert(err.response?.data?.message || "Failed to update decision");
    }
  };

  // ---------- render ----------

  return (
    <div className="rb-dashboard rb-dashboard-single">
      <div className="rb-dashboard-left">
        <h2>Find Materials</h2>
        <div className="rb-search-bar">
          <input
            placeholder="Search material (e.g. cement, bricks)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="rb-btn-primary rb-btn-full" onClick={searchMaterials}>
            {loadingMaterials ? "Searching..." : "Search"}
          </button>
        </div>

        {materials.length === 0 && !loadingMaterials && (
          <p>No materials yet. Ask suppliers to add inventory.</p>
        )}

        <MaterialList
          materials={materials}
          onRequest={(m) => setSelectedMaterial(m)}
        />

        <h2>My Requests</h2>
        {loadingRequests && <p>Loading requests...</p>}
        <div className="rb-material-list">
          {myRequests.map((r) => (
            <div key={r._id} className="rb-card material-card">
              <h3>{r.materialDetails}</h3>
              <p>Supplier: {r.supplier?.name}</p>
              <p>Quantity: {r.quantity}</p>
              <p>Status: {r.status}</p>
              {r.quotation && r.status !== "rejected" && (
                <>
                  <p>
                    Quote:{" "}
                    {r.quotation.price ? `₹${r.quotation.price}` : "N/A"}
                  </p>
                  {r.quotation.deliveryTime && (
                    <p>Delivery: {r.quotation.deliveryTime}</p>
                  )}
                  {r.quotation.terms && <p>Terms: {r.quotation.terms}</p>}
                </>
              )}
              <p>Contractor decision: {r.contractorDecision}</p>

              {r.status === "accepted" && r.contractorDecision === "none" && (
                <div className="rb-modal-actions">
                  <button
                    type="button"
                    className="rb-btn-primary"
                    onClick={() => handleDecision(r._id, "confirmed")}
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    className="rb-btn-secondary"
                    onClick={() => handleDecision(r._id, "withdrawn")}
                  >
                    Withdraw
                  </button>
                </div>
              )}
            </div>
          ))}
          {!loadingRequests && myRequests.length === 0 && (
            <p>No requests yet.</p>
          )}
        </div>
      </div>

      {selectedMaterial && (
        <RequestForm
          selectedMaterial={selectedMaterial}
          onSubmit={handleRequestSubmit}
          onClose={() => setSelectedMaterial(null)}
        />
      )}
    </div>
  );
};

export default DashboardContractor;
