import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Receipt.css";

function Receipt() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return <h2>No Receipt Found</h2>;
  }

  const receiptNo = "SSPS-" + Date.now().toString().slice(-6);

  const handlePrint = () => {
    window.print();

    toast.success("Receipt Printed");
  };

  const goDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="receipt-container">
      <div className="receipt">

        <h1>Sai Samarth Parking Service</h1>

        <p className="address">
          Truck Parking Management
        </p>

        <hr />

        <p>
          <b>Receipt No :</b> {receiptNo}
        </p>

        <hr />

        <p>
          <b>Truck Number :</b> {state.truck.truckNumber}
        </p>

        <p>
          <b>Vehicle :</b> {state.truck.vehicleType}
        </p>

        <p>
          <b>Driver :</b> {state.truck.driverName}
        </p>

        <p>
          <b>Mobile :</b> {state.truck.mobile}
        </p>

        <hr />

        <p>
          <b>Entry Time :</b>{" "}
          {new Date(state.truck.entryTime).toLocaleString()}
        </p>

        <p>
          <b>Exit Time :</b>{" "}
          {new Date(state.truck.exitTime).toLocaleString()}
        </p>

        <hr />

        <p>
          <b>Payment :</b>{" "}
          {state.paymentMethod || "Cash"}
        </p>

        <p>
          <b>Chargeable Days :</b> {state.days}
        </p>

        <p>
          <b>Rate :</b> ₹{state.rate}
        </p>

        <h2>
          Total : ₹{state.amount}
        </h2>

        <hr />

        <p
          style={{
            textAlign: "center",
            color: "#666",
          }}
        >
          Thank You! Visit Again.
        </p>

        <button
          onClick={handlePrint}
          style={{ marginBottom: "10px" }}
        >
          🖨 Print Receipt
        </button>

        <button
          onClick={goDashboard}
          style={{
            background: "#2563eb",
          }}
        >
          🏠 Back to Dashboard
        </button>

      </div>
    </div>
  );
}

export default Receipt;