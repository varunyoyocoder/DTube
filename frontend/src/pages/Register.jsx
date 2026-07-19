import "../styles/Register.css";
import { FcGoogle } from "react-icons/fc";
import dauthIcon from "../assets/dauth.png";
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

    const loginWithDAuth = () => {
  navigate("/dauthLogin");
};

const loginWithGoogle = () => {
  const state = crypto.randomUUID();
  sessionStorage.setItem("google_state", state);
  const clientID = import.meta.env.VITE_OAUTH_CLIENT_ID;
  const redirectURL = import.meta.env.VITE_OAUTH_REDIRECT_URI;
  const params = new URLSearchParams({
    client_id: clientID,
    redirect_uri: redirectURL,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt:"select_account",
  });
  window.location.href =
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
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
        </div>
        <div className="oauth-container">
          <button
            className="oauth-icon"
            onClick={loginWithGoogle}
            title="Continue with Google"
            aria-label="Continue with Google"
          >
            <FcGoogle size={32} />
          </button>
        
          <button
            className="oauth-icon"
            onClick={loginWithDAuth}
            title="Continue with DAuth"
            aria-label="Continue with DAuth"
          >
            <img src={dauthIcon} alt="DAuth" />
          </button>
        </div>
      </div>
    </div>
  );
}
export default Register;
