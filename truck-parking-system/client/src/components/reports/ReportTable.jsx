import "./ReportTable.css";

function ReportTable({ reports, exportToExcel, printReport }) {
  return (
    <div className="report-table-card">

      <div className="table-header">

        <h3>Truck Exit Reports</h3>

        <div className="table-actions">

          <button
            className="excel-btn"
            onClick={exportToExcel}
          >
            📊 Export Excel
          </button>

          <button
            className="print-btn"
            onClick={printReport}
          >
            🖨 Print Report
          </button>

        </div>

      </div>

      <div className="table-wrapper">

        <table className="report-table">

          <thead>

            <tr>
              <th>Truck No</th>
              <th>Vehicle</th>
              <th>Driver</th>
              <th>Mobile</th>
              <th>Payment</th>
              <th>Amount</th>
              <th>Exit Time</th>
            </tr>

          </thead>

          <tbody>

            {reports.length === 0 ? (

              <tr>

                <td
                  colSpan="7"
                  className="no-data"
                >
                  No Reports Found
                </td>

              </tr>

            ) : (

              reports.map((truck) => (

                <tr key={truck.id}>

                  <td>{truck.truckNumber}</td>

                  <td>{truck.vehicleType}</td>

                  <td>{truck.driverName}</td>

                  <td>{truck.mobile}</td>

                  <td>

                    <span
                      className={`payment ${truck.paymentMethod.toLowerCase()}`}
                    >
                      {truck.paymentMethod}
                    </span>

                  </td>

                  <td>₹{truck.amount}</td>

                  <td>
                    {new Date(
                      truck.exitTime
                    ).toLocaleString()}
                  </td>

                </tr>

              ))

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default ReportTable;