const express = require("express");

const router = express.Router();

const {
  createTruck,
  getTruckByNumber,
  exitTruck,
} = require("../controllers/truckController");

const {
  getReports,
} = require("../controllers/reportController");

// Create Entry
router.post("/", createTruck);

// Reports
router.get("/reports", getReports);

// Search Truck
router.get("/:truckNumber", getTruckByNumber);

// Exit Truck
router.put("/exit/:id", exitTruck);

module.exports = router;