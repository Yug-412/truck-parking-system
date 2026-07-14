const Truck = require("../models/Truck");

// Dashboard Statistics
const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();

    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const todayEntries = await Truck.countDocuments({
      entryTime: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    const todayExits = await Truck.countDocuments({
      exitTime: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    const activeTrucks = await Truck.countDocuments({
      status: "Parked",
    });

    const exitedToday = await Truck.find(
      {
        exitTime: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      },
      { exitTime: -1 }
    );

    let todayRevenue = 0;
    let cashRevenue = 0;
    let upiRevenue = 0;
    let cardRevenue = 0;

    exitedToday.forEach((truck) => {
      const amount = truck.amount || 0;
      todayRevenue += amount;

      if (truck.paymentMethod === "Cash") {
        cashRevenue += amount;
      } else if (truck.paymentMethod === "UPI") {
        upiRevenue += amount;
      } else if (truck.paymentMethod === "Card") {
        cardRevenue += amount;
      }
    });

    res.json({
      todayEntries,
      todayExits,
      activeTrucks,
      todayRevenue,
      cashRevenue,
      upiRevenue,
      cardRevenue,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Active Parked Trucks
const getActiveTrucks = async (req, res) => {
  try {
    const trucks = await Truck.find({ status: "Parked" }, { entryTime: -1 });
    res.json(trucks);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
  getActiveTrucks,
};