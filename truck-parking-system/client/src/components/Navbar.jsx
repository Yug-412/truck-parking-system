import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="brand">
        <h2>🚛 Sai Samarth Parking Service</h2>
      </div>

      <div className="user">
        <span>Admin</span>
        <button>Logout</button>
      </div>
    </header>
  );
}

export default Navbar;