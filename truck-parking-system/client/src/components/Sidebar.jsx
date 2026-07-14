import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaPlusCircle,
  FaTruck,
  FaChartBar,
  FaCog,
  FaTimes,
} from "react-icons/fa";

import "./Sidebar.css";

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}) {

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const isAdmin = user?.role === "Admin";

  const closeSidebar = () => {

    // Close sidebar automatically on tablet/mobile widths (<=1024)
    if (window.innerWidth <= 1024) {
      setSidebarOpen(false);
    }

  };

  return (

    <aside
      className={`sidebar ${
        sidebarOpen ? "open" : ""
      }`}
    >

      <div className="logo">

        <img
          src="/logo.png"
          alt="Logo"
          className="logo-img"
        />

        <button
          className="close-sidebar"
          onClick={() =>
            setSidebarOpen(false)
          }
        >
          <FaTimes />
        </button>

      </div>

      <nav>

        <NavLink
          to="/dashboard"
          onClick={closeSidebar}
          className={({ isActive }) =>
            isActive
              ? "menu active"
              : "menu"
          }
        >
          <FaHome />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/new-entry"
          onClick={closeSidebar}
          className={({ isActive }) =>
            isActive
              ? "menu active"
              : "menu"
          }
        >
          <FaPlusCircle />
          <span>New Entry</span>
        </NavLink>

        <NavLink
          to="/truck-exit"
          onClick={closeSidebar}
          className={({ isActive }) =>
            isActive
              ? "menu active"
              : "menu"
          }
        >
          <FaTruck />
          <span>Truck Exit</span>
        </NavLink>

        {isAdmin && (

          <NavLink
            to="/reports"
            onClick={closeSidebar}
            className={({ isActive }) =>
              isActive
                ? "menu active"
                : "menu"
            }
          >
            <FaChartBar />
            <span>Reports</span>
          </NavLink>

        )}

        {isAdmin && (

          <NavLink
            to="/settings"
            onClick={closeSidebar}
            className={({ isActive }) =>
              isActive
                ? "menu active"
                : "menu"
            }
          >
            <FaCog />
            <span>Settings</span>
          </NavLink>

        )}

      </nav>

    </aside>

  );

}

export default Sidebar;