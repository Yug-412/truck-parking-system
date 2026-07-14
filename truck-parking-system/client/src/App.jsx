import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import NewEntry from "./pages/NewEntry";
import TruckExit from "./pages/TruckExit";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Receipt from "./pages/Receipt";

import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />

      <Routes>

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* New Entry */}
        <Route
          path="/new-entry"
          element={
            <ProtectedRoute>
              <NewEntry />
            </ProtectedRoute>
          }
        />

        {/* Truck Exit */}
        <Route
          path="/truck-exit"
          element={
            <ProtectedRoute>
              <TruckExit />
            </ProtectedRoute>
          }
        />

        {/* Reports - Admin Only */}
        <Route
          path="/reports"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <Reports />
            </ProtectedRoute>
          }
        />

        {/* Settings - Admin Only */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute roles={["Admin"]}>
              <Settings />
            </ProtectedRoute>
          }
        />

        {/* Receipt */}
        <Route
          path="/receipt"
          element={
            <ProtectedRoute>
              <Receipt />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;