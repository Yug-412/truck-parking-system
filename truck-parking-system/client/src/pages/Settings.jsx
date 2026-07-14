import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import API from "../api";
import "./Settings.css";

function Settings() {

  const [settings, setSettings] = useState({
    companyName: "",
    ownerName: "",
    mobile: "",
    address: "",
    lightVehicleRate: 110,
    mediumVehicleRate: 150,
    heavyVehicleRate: 180,
    receiptFooter: "",
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {

      const response = await API.get("/settings");

      setSettings(response.data.data);

    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {

    setSettings({
      ...settings,
      [e.target.name]: e.target.value,
    });

  };

  const saveSettings = async () => {

    try {

      await API.put("/settings", settings);

      alert("Settings Saved Successfully");

    } catch (error) {

      alert("Unable to Save Settings");

    }

  };

  return (
    <MainLayout>

      <div className="settings-page">

        <div className="settings-card">

          <h1>Settings</h1>

          <div className="form-group">
            <label>Company Name</label>

            <input
              name="companyName"
              value={settings.companyName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Owner Name</label>

            <input
              name="ownerName"
              value={settings.ownerName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Mobile Number</label>

            <input
              name="mobile"
              value={settings.mobile}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Address</label>

            <textarea
              rows="3"
              name="address"
              value={settings.address}
              onChange={handleChange}
            />
          </div>

          <hr />

          <div className="form-group">
            <label>Light Vehicle Rate (₹)</label>

            <input
              type="number"
              name="lightVehicleRate"
              value={settings.lightVehicleRate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Medium Vehicle Rate (₹)</label>

            <input
              type="number"
              name="mediumVehicleRate"
              value={settings.mediumVehicleRate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Heavy Vehicle Rate (₹)</label>

            <input
              type="number"
              name="heavyVehicleRate"
              value={settings.heavyVehicleRate}
              onChange={handleChange}
            />
          </div>

          <hr />

          <div className="form-group">
            <label>Receipt Footer</label>

            <textarea
              rows="3"
              name="receiptFooter"
              value={settings.receiptFooter}
              onChange={handleChange}
            />
          </div>

          <button
            className="save-btn"
            onClick={saveSettings}
          >
            Save Settings
          </button>

        </div>

      </div>

    </MainLayout>
  );
}

export default Settings;