import { useEffect, useState } from "react";

import MainLayout from "../layouts/MainLayout";
import StatCard from "../components/StatCard";
import DashboardTable from "../components/DashboardTable";

import { getDashboardStats } from "../services/dashboardService";

import "./Dashboard.css";

function Dashboard() {
  const [stats, setStats] = useState({
    todayEntries: 0,
    todayExits: 0,
    activeTrucks: 0,
    todayRevenue: 0,
    cashRevenue: 0,
    upiRevenue: 0,
    cardRevenue: 0,
  });

  useEffect(() => {
    loadDashboard();

    const interval = setInterval(() => {
      loadDashboard();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadDashboard = async () => {
    try {
      const data = await getDashboardStats();
      setStats(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <MainLayout>
     <div className="dashboard">

    <div className="stats-grid">
        <StatCard
            title="Today's Entries"
            value={stats.todayEntries}
        />

        <StatCard
            title="Today's Exits"
            value={stats.todayExits}
        />

        <StatCard
            title="Active Trucks"
            value={stats.activeTrucks}
        />

        <StatCard
            title="Today's Revenue"
            value={`₹${stats.todayRevenue}`}
        />
    </div>

    <div className="section-heading">
        <h2>Payment Summary</h2>
    </div>

    <div className="payment-grid">
        <StatCard
            title="Cash Revenue"
            value={`₹${stats.cashRevenue}`}
        />

        <StatCard
            title="UPI Revenue"
            value={`₹${stats.upiRevenue}`}
        />

        <StatCard
            title="Card Revenue"
            value={`₹${stats.cardRevenue}`}
        />
    </div>

    <DashboardTable />

</div>
    </MainLayout>
  );
}

export default Dashboard;