import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="rb-navbar">
      <div className="rb-navbar-left">
        <span className="rb-logo">RoadNBrick</span>
      </div>
      <div className="rb-navbar-right">
        <Link to="/">Home</Link>
        {user && user.role === "contractor" && (
          <Link to="/contractor">Contractor</Link>
        )}
        {user && user.role === "supplier" && (
          <Link to="/supplier">Supplier</Link>
        )}
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="rb-btn-primary">
              Register
            </Link>
          </>
        ) : (
          <button onClick={handleLogout} className="rb-btn-secondary">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
