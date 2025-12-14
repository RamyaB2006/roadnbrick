import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const { ok, user } = await login(email, password);
    if (ok && user) {
      if (user.role === "contractor") navigate("/contractor");
      else if (user.role === "supplier") navigate("/supplier");
      else navigate("/");
    }
  };

  return (
    <div className="rb-auth-page">
      <form className="rb-auth-form" onSubmit={submit}>
        <h2>Login</h2>
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
        <button className="rb-btn-primary" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
