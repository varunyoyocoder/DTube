import { Link, useNavigate } from "react-router-dom";
import "../styles/DauthLogin.css";
function DauthLogin() {
   const loginWithDAuth = () => {
        const state = crypto.randomUUID();
        const nonce = crypto.randomUUID();
        sessionStorage.setItem("dauth_state", state);
        sessionStorage.setItem("dauth_nonce", nonce);
        const clientID=import.meta.env.VITE_DAUTH_CLIENT_ID;
        const redirectURL=import.meta.env.VITE_DAUTH_REDIRECT_URI
        const params = new URLSearchParams({
            client_id: clientID,
            redirect_uri: redirectURL,
            response_type: "code",
            grant_type: "authorization_code",
            scope: "openid email profile user",
            state,
            nonce
          });
          window.location.href = `https://auth.delta.nitt.edu/authorize?${params.toString()}`;
  }
    return (
      <div className="dauth-container">
        <div className="dauth-card">
        <h1 className="dauth-title">DAuth</h1>
        <a href="#" className="dauth-button" onClick={(e) => { e.preventDefault();loginWithDAuth();}}>
    Login with <span className="delta-symbol">Δ</span>
  </a>
        </div>
</div>
    );
}

export default DauthLogin;