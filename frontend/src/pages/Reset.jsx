import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import "../styles/Reset.css";
function Reset() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  const [form, setForm] = useState({
    newpassword: "",
    confirmpassword: "",
  });
  const [error, setError] = useState("");
  useEffect(() => {
    if (!email) {
      navigate("/password/forgot");
    }
  }, [email, navigate]);
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/password/reset", {
        email: email,
        newpassword: form.newpassword,
        confirmpassword: form.confirmpassword,
      });
      alert(response.data.message);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Reset failed");
    }
  };
  if (!email) return null;
  return (
    <div className="reset-container">
      <div className="reset-card">
        <h1>Reset Password</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            name="newpassword"
            value={form.newpassword}
            placeholder="New Password"
            onChange={handleChange}
          />
          <input
            type="password"
            name="confirmpassword"
            value={form.confirmpassword}
            placeholder="Confirm Password"
            onChange={handleChange}
          />
          <button type="submit">Reset Password</button>
        </form>
        <div className="back-login">
          <button type="button" onClick={() => navigate("/login")}>
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}
export default Reset;