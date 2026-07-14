import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./NewEntry.css";
import API from "../api";
import { FaArrowLeft } from "react-icons/fa";

function NewEntry() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    truckNumber: "",
    vehicleType: "Light Vehicle",
    driverName: "",
    mobile: "",
  });

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "truckNumber") {
      value = value.toUpperCase().trim();
    }

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/trucks", form);

      toast.success(response.data.message);

      setForm({
        truckNumber: "",
        vehicleType: "Light Vehicle",
        driverName: "",
        mobile: "",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (error) {

      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Server Error");
      }

      console.log(error);
    }
  };

  return (
  <div className="entry-container">

    <div className="entry-card">

      <div className="entry-top">

        <button
          type="button"
          className="back-btn"
          onClick={() => navigate("/dashboard")}
        >
          ← Back
        </button>

        <h2>New Truck Entry</h2>

      </div>

      <form onSubmit={handleSubmit}>

        <input
          type="text"
          name="truckNumber"
          placeholder="Truck Number"
          value={form.truckNumber}
          onChange={handleChange}
          required
        />

        <select
          name="vehicleType"
          value={form.vehicleType}
          onChange={handleChange}
        >
          <option>Light Vehicle</option>
          <option>Medium Vehicle</option>
          <option>Heavy Vehicle</option>
        </select>

        <input
          type="text"
          name="driverName"
          placeholder="Driver Name"
          value={form.driverName}
          onChange={handleChange}
        />

        <input
          type="text"
          name="mobile"
          placeholder="Mobile Number"
          value={form.mobile}
          onChange={handleChange}
        />

        <button
          className="save-btn"
          type="submit"
        >
          Save Entry
        </button>

      </form>

    </div>

  </div>
);
}

export default NewEntry;