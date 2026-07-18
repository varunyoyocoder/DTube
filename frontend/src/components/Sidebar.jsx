import "../styles/Sidebar.css";
import { NavLink } from "react-router-dom";

const NAV_ITEMS = [
  { to: "/", icon: "🏠", label: "Home", end: true },
  { to: "/subscription",icon: "📺", label: "Subscriptions" },
  { to:"/history",icon: "🕘", label: "History" },
  {to:"/likedVideos", icon: "👍", label: "Liked Videos" },
];

function Sidebar() {
  const userRole = localStorage.getItem("userRole");
  return (
    <aside className="sidebar">
      <ul>
        {NAV_ITEMS.map((item) =>
          item.to ? (
            <li key={item.label}>
              <NavLink to={item.to} end={item.end}>
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </NavLink>
            </li>
          ) : (
            <li key={item.label}>
              <span className="sidebar-item">
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </span>
            </li>
          ),
        )}

        {userRole === "admin" && (
          <li>
            <NavLink to="/admin/dashBoard">
              <span className="sidebar-icon">🖥️</span>
              <span className="sidebar-label">Admin Dashboard</span>
            </NavLink>
          </li>
        )}
      </ul>
    </aside>
  );
}

export default Sidebar;