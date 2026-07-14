import "../styles/Register.css";

import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";
import ReCAPTCHA from "react-google-recaptcha";

function Register() {
  const recaptchaRef = useRef(null);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const captchaToken = recaptchaRef.current.getValue();
    if (!captchaToken) {
      alert("Please complete reCAPTCHA");
      return;
    }
    try {
      const response = await api.post("/auth/register", {
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password.trim(),
        captchaToken: captchaToken,
      });
      alert("Registration successful");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
    finally {
        recaptchaRef?.current.reset();
      setLoading (false);
    }
  };
  return (
    <div className="register-container">
      <div className="register-card">
        <h1>Register</h1>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
          required
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
          />
          <input
          required
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
          <input
          required
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
          />
          <div className="recaptcha">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            />
          </div>
         <button type="submit" disabled={loading}>
    {loading ? "Registering..." : "Register"}
</button>
        </form>
        <div className="login-link">
          <li>  
          <Link to="/login">Already have an account? User Login</Link>
          </li>
          <li>  
          <Link to="/login">Already have an account? Admin Login</Link>
          </li>
        </div>
      </div>
    </div>
  );
}
export default Register;
