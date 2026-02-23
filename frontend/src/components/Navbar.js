import { Link } from "react-router-dom";

function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      <h2 className="logo">Courier System</h2>

      <div className="nav-links">
        <Link to="/">Add Entry</Link>
        <Link to="/records">Records</Link>
        <Link to="/billing">Billing</Link>

        {/* LOGOUT */}
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;