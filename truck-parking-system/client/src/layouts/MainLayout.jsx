import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import "./MainLayout.css";

function MainLayout({ children }) {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="layout">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="main-content">

        <Header
          setSidebarOpen={setSidebarOpen}
        />

        <div className="page-content">
          {children}
        </div>

      </div>

    </div>
  );
}

export default MainLayout;