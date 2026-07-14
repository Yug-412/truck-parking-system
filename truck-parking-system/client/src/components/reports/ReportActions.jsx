function ReportActions({
  exportToExcel,
  printReport,
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        gap: "15px",
        marginBottom: "20px",
      }}
    >
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
  );
}

export default ReportActions;