function Navbar() {
  return (
    <div className="navbar">
      <div className="nav-title">S-Courier System</div>

      <div className="nav-links">
        <a href="/">Add Entry</a>
        <a href="/records">Records</a>
        <a href="/billing">Billing</a>
      </div>
    </div>
  );
}

export default Navbar;
