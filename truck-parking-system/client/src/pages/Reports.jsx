import { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import API from "../api";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import ReportFilters from "../components/reports/ReportFilters";
import ReportSummary from "../components/reports/ReportSummary";
import ReportTable from "../components/reports/ReportTable";

import "./Reports.css";

function Reports() {

  const [reports, setReports] = useState([]);

  const [summary, setSummary] = useState({
    totalEntries: 0,
    totalExits: 0,
    totalRevenue: 0,
    cashRevenue: 0,
    upiRevenue: 0,
    cardRevenue: 0,
  });

  const [search, setSearch] = useState("");

  const [payment, setPayment] = useState("All");

  const [dateFilter, setDateFilter] = useState("all");

  const [fromDate, setFromDate] = useState("");

  const [toDate, setToDate] = useState("");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {

    try {

      let url = "/trucks/reports";

      if (dateFilter === "today") {
        url += "?filter=today";
      }

      else if (dateFilter === "month") {
        url += "?filter=month";
      }

      else if (
        dateFilter === "custom" &&
        fromDate &&
        toDate
      ) {
        url += `?from=${fromDate}&to=${toDate}`;
      }

      const response = await API.get(url);

      setReports(response.data.data);

      setSummary(response.data.summary);

    } catch (error) {

      console.log(error);

    }

  };

  const handleSearch = () => {
    loadReports();
  };

  const handleReset = () => {

    setSearch("");

    setPayment("All");

    setDateFilter("all");

    setFromDate("");

    setToDate("");

    loadReports();

  };

  const filteredReports = reports.filter((truck) => {

    const truckMatch =
      truck.truckNumber
        .toLowerCase()
        .includes(search.toLowerCase());

    const paymentMatch =
      payment === "All"
        ? true
        : truck.paymentMethod === payment;

    return truckMatch && paymentMatch;

  });

  const exportToExcel = () => {

    const excelData = filteredReports.map((truck) => ({

      "Truck Number": truck.truckNumber,

      Vehicle: truck.vehicleType,

      Driver: truck.driverName,

      Mobile: truck.mobile,

      Payment: truck.paymentMethod,

      Amount: truck.amount,

      "Entry Time":
        new Date(
          truck.entryTime
        ).toLocaleString(),

      "Exit Time":
        new Date(
          truck.exitTime
        ).toLocaleString(),

    }));

    const worksheet =
      XLSX.utils.json_to_sheet(excelData);

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Reports"
    );

    const excelBuffer =
      XLSX.write(workbook, {
        bookType: "xlsx",
        type: "array",
      });

    const file = new Blob(
      [excelBuffer],
      {
        type:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }
    );

    saveAs(
      file,
      `Parking_Report_${new Date()
        .toISOString()
        .slice(0, 10)}.xlsx`
    );

  };

  const printReport = () => {

    const printWindow = window.open(
      "",
      "",
      "width=1200,height=800"
    );

    printWindow.document.write(`
<html>

<head>

<title>Parking Report</title>

<style>

body{
font-family:Arial;
padding:30px;
}

table{
width:100%;
border-collapse:collapse;
margin-top:20px;
}

th,td{
border:1px solid #999;
padding:10px;
}

th{
background:#991B1B;
color:white;
}

h1{
text-align:center;
}

</style>

</head>

<body>

<h1>Sai Samarth Parking Service</h1>

<h3>Parking Report</h3>

<p><b>Date :</b> ${new Date().toLocaleString()}</p>

<p><b>Total Revenue :</b> ₹${summary.totalRevenue}</p>

<p><b>Cash :</b> ₹${summary.cashRevenue}</p>

<p><b>UPI :</b> ₹${summary.upiRevenue}</p>

<p><b>Card :</b> ₹${summary.cardRevenue}</p>

<table>

<tr>

<th>Truck</th>

<th>Vehicle</th>

<th>Driver</th>

<th>Payment</th>

<th>Amount</th>

<th>Exit Time</th>

</tr>

${filteredReports.map(truck=>`

<tr>

<td>${truck.truckNumber}</td>

<td>${truck.vehicleType}</td>

<td>${truck.driverName}</td>

<td>${truck.paymentMethod}</td>

<td>₹${truck.amount}</td>

<td>${new Date(truck.exitTime).toLocaleString()}</td>

</tr>

`).join("")}

</table>

</body>

</html>
`);

    printWindow.document.close();

    printWindow.print();

  };
    return (
    <MainLayout>

      <div className="reports-page">

        <h1 className="report-title">
          Reports
        </h1>

        <ReportFilters
          search={search}
          setSearch={setSearch}
          payment={payment}
          setPayment={setPayment}
          dateFilter={dateFilter}
          setDateFilter={setDateFilter}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          onSearch={handleSearch}
          onReset={handleReset}
        />

        <ReportSummary
          summary={summary}
        />

        <ReportTable
          reports={filteredReports}
          exportToExcel={exportToExcel}
          printReport={printReport}
        />

      </div>

    </MainLayout>
  );
}

export default Reports;