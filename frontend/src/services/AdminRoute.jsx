import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "../services/api";
function AdminRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    const verifyAdmin = async () => {
      try {
        const response = await api.get("/auth/me");
        setIsAdmin(response.data.role === "admin");
      } catch {
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };
    verifyAdmin();
  }, []);
  if (loading) {
    return <h3>Loading...</h3>;
  }
  return isAdmin ? children : <Navigate to="/home" replace />;
}
export default AdminRoute;