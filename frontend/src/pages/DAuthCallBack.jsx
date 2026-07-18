import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function DAuthCallback() {
    const navigate = useNavigate();
    useEffect(() => {
        const login = async () => {
            const params = new URLSearchParams(window.location.search);
            const returnedState = params.get("state");
const storedState = sessionStorage.getItem("dauth_state");
if (returnedState !== storedState) {
    console.error("Invalid state");
    navigate("/login");
    return;
}
            const code = params.get("code");
            console.log("Authorization code:", code);
            if (!code) {
                console.log("Authorization code:", code);
                navigate("/login");
                return;
            }
            try {
                const res = await api.post("/auth/dauth/token", {
                    code:code,
                });
                console.log("Backend response:", res.data);
                localStorage.setItem("accessToken", res.data.accessToken);
                localStorage.setItem("refreshToken", res.data.refreshToken);
                localStorage.setItem("userId", res.data.userId);
localStorage.setItem("username", res.data.username);
localStorage.setItem("profileImage", res.data.profileImage);
localStorage.setItem("userRole", res.data.userRole);
localStorage.setItem("isBanned", res.data.isBanned);
                navigate("/home");
            } catch (err) {
                console.error(err);
                navigate("/login");
            }
        };
        login();
    }, [navigate]);

    return < h2 style ={{color:"#1cb150"}}>Signing you in...</h2>;
}