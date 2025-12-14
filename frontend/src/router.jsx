import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import DashboardContractor from "./pages/DashboardContractor.jsx";
import DashboardSupplier from "./pages/DashboardSupplier.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/contractor"
        element={
          <ProtectedRoute roles={["contractor"]}>
            <DashboardContractor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/supplier"
        element={
          <ProtectedRoute roles={["supplier"]}>
            <DashboardSupplier />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
