import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar">
      <div className="nav-title">S-Courier System</div>

      <div className="nav-links">
        <Link to="/">Add Entry</Link>
        <Link to="/records">Records</Link>
        <Link to="/billing">Billing</Link>
      </div>
    </div>
  );
}

export default Navbar;
