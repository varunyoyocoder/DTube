import "../styles/Login.css";

import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import ReCAPTCHA from "react-google-recaptcha";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const recaptchaRef = useRef(null);
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
    const captchaToken = recaptchaRef.current.getValue();
    if (!captchaToken) {
      alert("Please complete reCAPTCHA");
      return;
    }
    try {
      const response = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
        captchaToken: captchaToken,
      });

      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("userRole", response.data.userRole);
      localStorage.setItem("isBanned", response.data.isBanned);
      if (response.data.profileImage)localStorage.setItem("profileImage", response.data.profileImage);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      console.log(response.data.refreshToken);
      console.log(response.data.accessToken);
      if (response.data.isBanned) {
        alert("Your account has been banned.");
        setError(
          "Your account has been banned. Please contact an administrator.",
        );
        return;
        alert("Login Successful");
      } else {
        navigate("/home");
      }
    } catch (err) {
      console.log("Full error:", err);
      console.log("Response:", err.response);
      console.log("Data:", err.response?.data);
      console.log("Status:", err.response?.status);
      console.log(err);
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Login</h1>

        {error && <p className="error">{error}</p>}

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />

          <div className="forgot-password">
            <Link to="/password/forgot">Forgot password?</Link>
          </div>

          <div className="recaptcha">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            />
          </div>

          <button type="submit">Login</button>
        </form>

        <div className="register-link">
          <Link to="/register">Don't have an account? Register</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
