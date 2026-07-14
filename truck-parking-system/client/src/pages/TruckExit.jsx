import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../api";
import "./TruckExit.css";

function TruckExit() {
  const [truckNumber, setTruckNumber] = useState("");
  const [truck, setTruck] = useState(null);
  const [history, setHistory] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [confirmExit, setConfirmExit] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.truckNumber) {
      setTruckNumber(location.state.truckNumber);
      searchTruck(location.state.truckNumber);
    }
  }, []);

  const searchTruck = async (number = truckNumber) => {

    if (!number.trim()) {
      toast.warning("Please enter Truck Number");
      return;
    }

    try {

      const response = await API.get(`/trucks/${number}`);

      setTruck(response.data.data);
      setHistory(response.data.history);

      setPaymentMethod("Cash");
      setConfirmExit(false);

    } catch (error) {

      toast.error("Truck Not Found");

      setTruck(null);
      setHistory([]);

    }

  };

  const completeExit = async () => {

    if (!confirmExit) {
      toast.warning("Please confirm payment received.");
      return;
    }

    try {
      const truckId = truck.id || truck._id;
      if (!truckId) {
        toast.error("Truck ID is not available for exit.");
        return;
      }

      const response = await API.put(
        `/trucks/exit/${truckId}`,
        {
          paymentMethod,
        }
      );

      toast.success("Truck Exit Completed");

      setTimeout(() => {

        navigate("/receipt", {
          state: {
            truck: response.data.truck,
            days: response.data.days,
            rate: response.data.rate,
            amount: response.data.amount,
            paymentMethod,
          },
        });

      }, 800);

    } catch (error) {

      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Server Error");
      }

    }

  };

  return (
<div className="exit-container">

<div className="exit-wrapper">

<div className="page-header">

<button
className="back-btn"
onClick={() => navigate("/dashboard")}
>
← Dashboard
</button>

<h2>Truck Exit</h2>

</div>

{/* Search Card */}

<div className="section-card">

<h3>Search Truck</h3>

<div className="search-box">

<input
type="text"
placeholder="Enter Truck Number"
value={truckNumber}
onChange={(e)=>
setTruckNumber(e.target.value.toUpperCase())
}
onKeyDown={(e)=>{
if(e.key==="Enter"){
searchTruck();
}
}}
/>

<button
className="search-btn"
onClick={()=>searchTruck()}
>
Search
</button>

</div>

</div>

{truck && (

<>

{/* Truck Details */}

<div className="section-card">

<h3>Truck Information</h3>

<div className="info-grid">

<div className="info-item">
<span>Truck Number</span>
<h4>{truck.truckNumber}</h4>
</div>

<div className="info-item">
<span>Vehicle Type</span>
<h4>{truck.vehicleType}</h4>
</div>

<div className="info-item">
<span>Driver Name</span>
<h4>{truck.driverName}</h4>
</div>

<div className="info-item">
<span>Mobile</span>
<h4>{truck.mobile}</h4>
</div>

<div className="info-item full-width">
<span>Entry Time</span>

<h4>
{new Date(
truck.entryTime
).toLocaleString()}
</h4>

</div>

</div>

</div>

{/* Payment */}

<div className="section-card">

<h3>Payment</h3>

<label>
Payment Method
</label>

<select
value={paymentMethod}
onChange={(e)=>
setPaymentMethod(e.target.value)
}
>
<option>Cash</option>
<option>UPI</option>
<option>Card</option>
</select>

<label className="confirm-box">

<input
type="checkbox"
checked={confirmExit}
onChange={(e)=>
setConfirmExit(e.target.checked)
}
/>

Payment Received

</label>

<button
className="exit-btn"
disabled={!confirmExit}
onClick={completeExit}
>
Complete Exit
</button>

</div>
{/* Vehicle History */}

<div className="section-card">

    <h3>Vehicle History</h3>

    <div className="history-box">

        <div className="history-item">

            <span>Total Visits</span>

            <h4>{history.length}</h4>

        </div>

        {history.length > 1 && (

            <div className="history-item">

                <span>Previous Visit</span>

                <h4>
                    {new Date(
                        history[1].entryTime
                    ).toLocaleString()}
                </h4>

            </div>

        )}

    </div>

</div>

</>

)}

</div>

</div>

);
}



export default TruckExit;