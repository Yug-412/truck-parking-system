const Truck = require("../models/Truck");

// Date Range Reports
const getReports = async (req, res) => {
  try {
    const { filter, from, to } = req.query;

    let query = {
      status: "Exited",
    };

    const today = new Date();

    if (filter === "today") {
      const start = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const end = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );

      query.exitTime = {
        $gte: start,
        $lt: end,
      };
    } else if (filter === "month") {
      const start = new Date(
        today.getFullYear(),
        today.getMonth(),
        1
      );
      const end = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        1
      );

      query.exitTime = {
        $gte: start,
        $lt: end,
      };
    } else if (from && to) {
      const start = new Date(from);
      start.setHours(0, 0, 0, 0);
      const end = new Date(to);
      end.setHours(23, 59, 59, 999);

      query.exitTime = {
        $gte: start,
        $lte: end,
      };
    }

    const reports = await Truck.find(query, { exitTime: -1 });

    let totalRevenue = 0;
    let cashRevenue = 0;
    let upiRevenue = 0;
    let cardRevenue = 0;

    reports.forEach((truck) => {
      totalRevenue += truck.amount || 0;

      if (truck.paymentMethod === "Cash") {
        cashRevenue += truck.amount || 0;
      }
      if (truck.paymentMethod === "UPI") {
        upiRevenue += truck.amount || 0;
      }
      if (truck.paymentMethod === "Card") {
        cardRevenue += truck.amount || 0;
      }
    });

    res.json({
      success: true,
      summary: {
        totalEntries: reports.length,
        totalExits: reports.length,
        totalRevenue,
        cashRevenue,
        upiRevenue,
        cardRevenue,
      },
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getReports,
};