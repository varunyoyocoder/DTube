import "../styles/Login.css";
import { useState, useRef } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import api from "../services/api";
import dauthIcon from "../assets/dauth.png";

function Login() {
  const navigate = useNavigate();
  const recaptchaRef = useRef(null);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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

    if (!recaptchaRef.current) {
      alert("reCAPTCHA is still loading. Please wait.");
      return;
    }

    const captchaToken = recaptchaRef.current.getValue();

    if (!captchaToken) {
      alert("Please complete reCAPTCHA.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
        captchaToken,
      });

      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("userId", response.data.userId);
      localStorage.setItem("userRole", response.data.userRole);
      localStorage.setItem("isBanned", response.data.isBanned);

      if (response.data.profileImage) {
        localStorage.setItem("profileImage", response.data.profileImage);
      }

      if (response.data.isBanned) {
        setError(
          "Your account has been banned. Please contact an administrator."
        );
        return;
      }

      alert("Login Successful");
      navigate("/home");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Login failed"
      );
    } finally {
      recaptchaRef.current?.reset();
      setLoading(false);
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

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="register-link">
          <Link to="/register">
            Don't have an account? Register
          </Link>
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

export default Login;