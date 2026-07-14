const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const db = require("./config/db");

const truckRoutes = require("./routes/truckRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

// Initialize Database
// eslint-disable-next-line no-unused-vars
const database = db.db;

const app = express();

// Middleware
const corsOptions = {
  origin: process.env.FRONTEND_URL || '*',
};
app.use(cors(corsOptions));
app.use(express.json());

// Test Route
app.get("/", (req, res) => {
  res.send("🚛 Sai Samarth Parking Service Backend Running...");
});

// ======================
// API Routes
// ======================

app.use("/api/auth", authRoutes);

app.use("/api/trucks", truckRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/settings", settingsRoutes);

// ======================
// Start Server
// ======================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});