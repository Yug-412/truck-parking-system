import { useNavigate } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import "./Header.css";

function Header({ setSidebarOpen }) {

  const navigate = useNavigate();

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const handleLogout = () => {

    if (window.confirm("Are you sure you want to logout?")) {

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      navigate("/login");

    }

  };

  return (

    <header className="header">

      <div className="header-left">

        <button
          className="menu-btn"
          onClick={() => setSidebarOpen(true)}
        >
          <FaBars />
        </button>

        <div>

          <h2>Sai Samarth Parking Service</h2>

          <p>{today}</p>

        </div>

      </div>

      <div className="admin-section">

        <div className="admin-info">

          <h4>
            {user?.name || "Administrator"}
          </h4>

          <span>
            {user?.role || "Admin"}
          </span>

        </div>

        <button onClick={handleLogout}>
          Logout
        </button>

      </div>

    </header>

  );

}

export default Header;