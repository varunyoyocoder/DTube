import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import "../styles/Forgot.css";

function Forgot() {
  const [form, setForm] = useState({
    email: "",
    otp: "",
  });
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError("");
    console.log("Sending request...");
    setShowOTP(true);
    setTimeLeft(300);
    try {
      const response=await api.post("/password/forgot/reqOTP", {
        email: form.email,
      });
      console.log("Success:", response.data);
      alert("OTP sent");
    } catch (err) {
      console.log(err);
      console.log(err.response);
      setError(err.response?.data?.error || "Failed to send OTP");
    }
  };

  const [timeLeft, setTimeLeft] = useState(300);
  useEffect(() => {
    console.log(showOTP);
    if (!showOTP) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showOTP]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response=await api.post("/password/forgot/verifyOTP", {
        email: form.email,
        otp: form.otp,
      });
      console.log(response)
      alert(response.data.message);

      navigate("/password/reset", {
        state: {
          email: form.email,
        },
      });
    } catch (err) {
      setError(err.response?.data?.error || "Invalid OTP");
    }
  };

  return (
  <div className="forgot-container">
    <div className="forgot-card">
      <h1>Forgot Password</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleRequestOTP}>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your email"
          disabled={showOTP}
        />

        <button type="submit" disabled={showOTP}>
          Request OTP
        </button>
      </form>

      {showOTP && (
        <form onSubmit={handleVerifyOTP}>
          <input
            name="otp"
            type="text"
            value={form.otp}
            onChange={handleChange}
            placeholder="Enter OTP"
          />

          <p className="timer">
            {Math.floor(timeLeft / 60)}:
            {String(timeLeft % 60).padStart(2, "0")}
          </p>

          <button type="submit" disabled={timeLeft === 0}>
            Verify OTP
          </button>

          {timeLeft === 0 && (
            <p className="expired">
              OTP expired. Please request a new OTP.
            </p>
          )}
        </form>
      )}

      <div className="back-login">
        <Link to="/login">← Back to Login</Link>
      </div>
    </div>
  </div>
);
}

export default Forgot;
