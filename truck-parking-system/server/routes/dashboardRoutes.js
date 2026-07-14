const express = require("express");

const router = express.Router();

const {
  getDashboardStats,
  getActiveTrucks,
} = require("../controllers/dashboardController");

router.get("/", getDashboardStats);

router.get("/active-trucks", getActiveTrucks);

module.exports = router;