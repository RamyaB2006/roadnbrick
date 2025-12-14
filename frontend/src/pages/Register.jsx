import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { register, loading } = useAuth();
  const [name, setName] = useState("");
  const [role, setRole] = useState("contractor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const r = params.get("role");
    if (r === "contractor" || r === "supplier") setRole(r);
  }, [location.search]);

  const submit = async (e) => {
    e.preventDefault();
    const { ok, user } = await register({ name, email, password, role });
    if (ok && user) {
      if (user.role === "contractor") navigate("/contractor");
      else if (user.role === "supplier") navigate("/supplier");
      else navigate("/");
    }
  };

  return (
    <div className="rb-auth-page">
      <form className="rb-auth-form" onSubmit={submit}>
        <h2>Register</h2>
        <label>Name</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="contractor">Contractor / Builder</option>
          <option value="supplier">Material Supplier</option>
        </select>
        <button className="rb-btn-primary" disabled={loading}>
          {loading ? "Loading..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
