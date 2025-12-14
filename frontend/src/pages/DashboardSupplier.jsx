// frontend/src/pages/DashboardSupplier.jsx
import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import "../styles/dashboard.css";

const DashboardSupplier = () => {
  const [profile, setProfile] = useState(null);
  const [materials, setMaterials] = useState([]);
  const [requests, setRequests] = useState([]);

  const [profileForm, setProfileForm] = useState({
    shopName: "",
    address: "",
    phoneNumber: ""
  });

  const [materialForm, setMaterialForm] = useState({
    name: "",
    category: "",
    price: "",
    unit: "bag",
    stockQuantity: "",
    availabilityStatus: "available"
  });

  // response form for supplier (quote)
  const [responseForm, setResponseForm] = useState({
    price: "",
    deliveryTime: "",
    terms: ""
  });
  const [activeRequestId, setActiveRequestId] = useState(null);

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // -------- load profile --------

  const fetchProfile = async () => {
    setLoadingProfile(true);
    try {
      const { data } = await axiosClient.get("/profile/supplier/me");
      setProfile(data);
      setProfileForm({
        shopName: data?.shopName || "",
        address: data?.address || "",
        phoneNumber: data?.phoneNumber || ""
      });
    } catch (err) {
      console.error("Profile load error", err);
      alert(err.response?.data?.message || "Failed to load profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  // -------- load materials --------

  const fetchMaterials = async (profileData) => {
    setLoadingMaterials(true);
    try {
      const { data } = await axiosClient.get("/materials");
      const supplierProfile = profileData || profile;
      const mine = supplierProfile
        ? data.filter(
            (m) =>
              m.supplier &&
              (m.supplier._id === supplierProfile._id ||
                m.supplier === supplierProfile._id)
          )
        : [];
      setMaterials(mine);
    } catch (err) {
      console.error("Materials load error", err);
      alert(err.response?.data?.message || "Failed to load materials");
    } finally {
      setLoadingMaterials(false);
    }
  };

  // -------- load requests --------

  const fetchRequests = async () => {
    setLoadingRequests(true);
    try {
      const { data } = await axiosClient.get("/requests/mine");
      setRequests(data);
    } catch (err) {
      console.error("Requests load error", err);
      alert(err.response?.data?.message || "Failed to load requests");
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (profile) {
      fetchMaterials(profile);
      fetchRequests();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  // -------- profile submit --------

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoadingProfile(true);
    try {
      const { data } = await axiosClient.put("/profile/supplier/me", {
        shopName: profileForm.shopName,
        address: profileForm.address,
        phoneNumber: profileForm.phoneNumber
      });
      setProfile(data);
      alert("Profile saved");
    } catch (err) {
      console.error("Profile save error", err);
      alert(err.response?.data?.message || "Failed to save profile");
    } finally {
      setLoadingProfile(false);
    }
  };

  // -------- material submit --------

  const handleMaterialSubmit = async (e) => {
    e.preventDefault();
    if (!profile) {
      alert("Save your profile first.");
      return;
    }

    try {
      await axiosClient.post("/materials", {
        ...materialForm,
        price: Number(materialForm.price),
        stockQuantity: Number(materialForm.stockQuantity)
      });
      setMaterialForm({
        name: "",
        category: "",
        price: "",
        unit: "bag",
        stockQuantity: "",
        availabilityStatus: "available"
      });
      await fetchMaterials();
      alert("Material added");
    } catch (err) {
      console.error("Material add error", err);
      alert(err.response?.data?.message || "Failed to add material");
    }
  };

  const handleDeleteMaterial = async (id) => {
    try {
      await axiosClient.delete(`/materials/${id}`);
      await fetchMaterials();
    } catch (err) {
      console.error("Material delete error", err);
      alert(err.response?.data?.message || "Failed to delete material");
    }
  };

  // -------- request responses --------

  const openRespondForm = (requestId) => {
    setActiveRequestId(requestId);
    setResponseForm({
      price: "",
      deliveryTime: "",
      terms: ""
    });
  };

  const sendResponse = async (requestId, status) => {
    try {
      await axiosClient.put(`/requests/${requestId}/respond`, {
        status,
        price: responseForm.price ? Number(responseForm.price) : undefined,
        deliveryTime: responseForm.deliveryTime || undefined,
        terms: responseForm.terms || undefined
      });
      setActiveRequestId(null);
      await fetchRequests();
      alert(`Request ${status}`);
    } catch (err) {
      console.error("Respond error", err);
      alert(err.response?.data?.message || "Failed to respond");
    }
  };

  // -------- render --------

  return (
    <div className="rb-dashboard rb-dashboard-supplier">
      <div className="rb-dashboard-left">
        <h2>Supplier Profile</h2>
        <form className="rb-profile-form" onSubmit={handleProfileSubmit}>
          <label>Shop Name</label>
          <input
            value={profileForm.shopName}
            onChange={(e) =>
              setProfileForm({ ...profileForm, shopName: e.target.value })
            }
            required
          />

          <label>Address</label>
          <input
            value={profileForm.address}
            onChange={(e) =>
              setProfileForm({ ...profileForm, address: e.target.value })
            }
            required
          />

          <label>Phone Number</label>
          <input
            value={profileForm.phoneNumber}
            onChange={(e) =>
              setProfileForm({ ...profileForm, phoneNumber: e.target.value })
            }
            required
          />

          <button className="rb-btn-primary rb-btn-full" type="submit">
            {loadingProfile ? "Saving..." : "Save Profile"}
          </button>
        </form>

        <h2>Inventory</h2>
        <form className="rb-material-form" onSubmit={handleMaterialSubmit}>
          <label>Material Name</label>
          <input
            value={materialForm.name}
            onChange={(e) =>
              setMaterialForm({ ...materialForm, name: e.target.value })
            }
            required
          />

          <label>Category</label>
          <input
            value={materialForm.category}
            onChange={(e) =>
              setMaterialForm({ ...materialForm, category: e.target.value })
            }
            required
          />

          <label>Price (INR)</label>
          <input
            type="number"
            min="0"
            value={materialForm.price}
            onChange={(e) =>
              setMaterialForm({ ...materialForm, price: e.target.value })
            }
            required
          />

          <label>Unit</label>
          <select
            value={materialForm.unit}
            onChange={(e) =>
              setMaterialForm({ ...materialForm, unit: e.target.value })
            }
          >
            <option value="bag">bag</option>
            <option value="kg">kg</option>
            <option value="ton">ton</option>
          </select>

          <label>Stock Quantity</label>
          <input
            type="number"
            min="0"
            value={materialForm.stockQuantity}
            onChange={(e) =>
              setMaterialForm({
                ...materialForm,
                stockQuantity: e.target.value
              })
            }
            required
          />

          <label>Availability</label>
          <select
            value={materialForm.availabilityStatus}
            onChange={(e) =>
              setMaterialForm({
                ...materialForm,
                availabilityStatus: e.target.value
              })
            }
          >
            <option value="available">available</option>
            <option value="unavailable">unavailable</option>
          </select>

          <button className="rb-btn-primary rb-btn-full" type="submit">
            Add Material
          </button>
        </form>
      </div>

      <div className="rb-dashboard-right">
        <h2>Your Materials</h2>
        {loadingMaterials && <p>Loading materials...</p>}
        <div className="rb-material-list">
          {materials.map((m) => (
            <div key={m._id} className="rb-card material-card">
              <h3>{m.name}</h3>
              <p className="rb-chip">{m.category}</p>
              <p>
                ₹{m.price} / {m.unit}
              </p>
              <p>Stock: {m.stockQuantity}</p>
              <p>Status: {m.availabilityStatus}</p>
              <button
                className="rb-btn-secondary rb-btn-full"
                type="button"
                onClick={() => handleDeleteMaterial(m._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <h2>Incoming Requests</h2>
        {loadingRequests && <p>Loading requests...</p>}
        <div className="rb-material-list">
          {requests.map((r) => (
            <div key={r._id} className="rb-card material-card">
              <h3>{r.materialDetails}</h3>
              <p>Quantity: {r.quantity}</p>
              <p>From: {r.contractor?.name}</p>
              <p>Status: {r.status}</p>
              <p>Contractor decision: {r.contractorDecision}</p>

              {r.quotation && (
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

              {activeRequestId === r._id ? (
                <div className="rb-request-response">
                  <label>Quote Price (INR)</label>
                  <input
                    type="number"
                    min="0"
                    value={responseForm.price}
                    onChange={(e) =>
                      setResponseForm({
                        ...responseForm,
                        price: e.target.value
                      })
                    }
                  />
                  <label>Delivery Time</label>
                  <input
                    value={responseForm.deliveryTime}
                    onChange={(e) =>
                      setResponseForm({
                        ...responseForm,
                        deliveryTime: e.target.value
                      })
                    }
                    placeholder="e.g. 3 days"
                  />
                  <label>Terms</label>
                  <textarea
                    rows="2"
                    value={responseForm.terms}
                    onChange={(e) =>
                      setResponseForm({
                        ...responseForm,
                        terms: e.target.value
                      })
                    }
                    placeholder="Payment, transport, etc."
                  />
                  <div className="rb-modal-actions">
                    <button
                      type="button"
                      className="rb-btn-secondary"
                      onClick={() => setActiveRequestId(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="rb-btn-primary"
                      onClick={() => sendResponse(r._id, "accepted")}
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      className="rb-btn-secondary"
                      onClick={() => sendResponse(r._id, "rejected")}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ) : (
                r.status === "pending" && (
                  <button
                    type="button"
                    className="rb-btn-primary rb-btn-full"
                    onClick={() => openRespondForm(r._id)}
                  >
                    Respond
                  </button>
                )
              )}
            </div>
          ))}

          {!loadingRequests && requests.length === 0 && (
            <p>No requests yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardSupplier;
