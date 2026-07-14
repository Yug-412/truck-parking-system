import "./ReportSummary.css";

function ReportSummary({ summary }) {
  const cards = [
    {
      title: "Total Entries",
      value: summary.totalEntries,
    },
    {
      title: "Total Exits",
      value: summary.totalExits,
    },
    {
      title: "Cash Revenue",
      value: `₹${summary.cashRevenue}`,
    },
    {
      title: "UPI Revenue",
      value: `₹${summary.upiRevenue}`,
    },
    {
      title: "Card Revenue",
      value: `₹${summary.cardRevenue}`,
    },
    {
      title: "Total Revenue",
      value: `₹${summary.totalRevenue}`,
    },
  ];

  return (
    <div className="report-summary-grid">

      {cards.map((card, index) => (

        <div
          key={index}
          className="summary-card"
        >

          <h4>{card.title}</h4>

          <h2>{card.value}</h2>

        </div>

      ))}

    </div>
  );
}

export default ReportSummary;