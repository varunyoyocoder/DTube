import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import "../styles/Layout.css"

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <div className="page-content">
        <Sidebar />
        <main className="page-main">{children}</main>
      </div>
    </>
  );
}

export default Layout;
