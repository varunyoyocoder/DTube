import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import "../styles/Reset.css";

function Reset() {
  const location = useLocation();
  const email = location.state?.email;
  if (!email) {
    navigate("/password/forgot");
    return null;
  }
  const [form, setForm] = useState({
    newpassword: "",
    confirmpassword: "",
  });
  const navigate = useNavigate();

  const [error, setError] = useState("");

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
      setError(err.response?.data?.error || "Reset");
    }
  };

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

        <button type="submit">
          Reset Password
        </button>
      </form>

      <div className="back-login">
        <button
          type="button"
          onClick={() => navigate("/login")}
          style={{
            background: "none",
            border: "none",
            color: "#065fd4",
            cursor: "pointer",
            fontSize: "15px",
          }}
        >
          ← Back to Login
        </button>
      </div>
    </div>
  </div>
);
}

export default Reset;
