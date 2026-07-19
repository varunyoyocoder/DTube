import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function GoogleCallback() {
  const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
  useEffect(() => {
    const login = async () => {
           if (loading) return;
           setLoading(true);
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const returnedState = params.get("state");
      const storedState = sessionStorage.getItem("google_state");
      if (returnedState !== storedState) {
         console.error("Invalid state");
        return navigate("/login");
      }
      if (!code) {
        console.log("Authorization code:", code);
        navigate("/login");
        return;
      }
      try {
        const response = await api.post("/auth/google/token", {
          code,
        });
localStorage.setItem("accessToken", response.data.accessToken);
        localStorage.setItem("refreshToken", response.data.refreshToken);
        localStorage.setItem("userId", response.data.userId);
        localStorage.setItem("username", response.data.username);
        localStorage.setItem("profileImage", response.data.profileImage);
        localStorage.setItem("userRole", response.data.userRole);
        localStorage.setItem("isBanned", response.data.isBanned);
        navigate("/home");
      } catch (err) {
       console.error(err);
          console.log(err.response?.status);
        console.log(err.response?.data);
        navigate("/login");
      }
    };

    login();
  }, [navigate]);

  return <h2 style={{ color: "#1cb150" }}>Signing you in...</h2>;
}