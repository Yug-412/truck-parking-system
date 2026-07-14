import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getActiveTrucks } from "../services/dashboardService";
import "./DashboardTable.css";

function DashboardTable() {
  const [trucks, setTrucks] = useState([]);
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

useEffect(() => {
  loadTrucks();

  const interval = setInterval(() => {
    loadTrucks();
  }, 5000);

  return () => clearInterval(interval);

}, []);

  const loadTrucks = async () => {
    try {
      const data = await getActiveTrucks();
      setTrucks(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleExit = (truckNumber) => {
    navigate("/truck-exit", {
      state: { truckNumber },
    });
  };

  const filteredTrucks = trucks.filter((truck) =>
    truck.truckNumber.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-table">

      <div className="table-header">

        <h2>Active Parked Trucks</h2>

        <input
          type="text"
          placeholder="Search Truck Number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-box"
        />

      </div>

      <table>
        <thead>
          <tr>
            <th>Truck Number</th>
            <th>Vehicle</th>
            <th>Driver</th>
            <th>Mobile</th>
            <th>Entry Time</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>

          {filteredTrucks.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No Truck Found
              </td>
            </tr>
          ) : (
            filteredTrucks.map((truck) => (
              <tr key={truck.id}>
                <td>{truck.truckNumber}</td>
                <td>{truck.vehicleType}</td>
                <td>{truck.driverName}</td>
                <td>{truck.mobile}</td>
                <td>
                  {new Date(truck.entryTime).toLocaleString()}
                </td>
                <td>
                  <span className="status">
                    {truck.status}
                  </span>
                </td>
                <td>
                  <button
                    className="exit-btn"
                    onClick={() => handleExit(truck.truckNumber)}
                  >
                    Exit
                  </button>
                </td>
              </tr>
            ))
          )}

        </tbody>
      </table>

    </div>
  );
}

export default DashboardTable;