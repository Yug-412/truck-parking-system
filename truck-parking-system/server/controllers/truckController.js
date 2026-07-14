const Truck = require("../models/Truck");
const Settings = require("../models/Settings");

// Create Truck Entry
const createTruck = async (req, res) => {
  try {
    const truckNumber = req.body.truckNumber.toUpperCase();

    const existingTruck = await Truck.findOne({
      truckNumber,
      status: "Parked",
    });

    if (existingTruck) {
      return res.status(400).json({
        success: false,
        message: `Truck ${truckNumber} is already parked.`,
      });
    }

    req.body.truckNumber = truckNumber;

    const truck = await Truck.create(req.body);

    res.status(201).json({
      success: true,
      message: "Truck Entry Saved Successfully",
      data: truck,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Reports
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
    }

    if (filter === "month") {
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
    }

    if (from && to) {
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

    res.json({
      success: true,
      data: reports,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Search Truck
const getTruckByNumber = async (req, res) => {
  try {
    const truckNumber = req.params.truckNumber.toUpperCase();

    const truck = await Truck.findOne({
      truckNumber,
      status: "Parked",
    });

    if (!truck) {
      return res.status(404).json({
        success: false,
        message: "Truck Not Found",
      });
    }

    const history = await Truck.find({ truckNumber }, { entryTime: -1 });

    res.json({
      success: true,
      data: truck,
      history,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Truck Exit
const exitTruck = async (req, res) => {
  try {
    const truck = await Truck.findById(req.params.id);

    if (!truck) {
      return res.status(404).json({
        success: false,
        message: "Truck Not Found",
      });
    }

    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }

    const exitTime = new Date();
    const entryTime = new Date(truck.entryTime);
    const diff = exitTime - entryTime;
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    let rate = 0;
    if (truck.vehicleType === "Light Vehicle") {
      rate = settings.lightVehicleRate;
    }
    if (truck.vehicleType === "Medium Vehicle") {
      rate = settings.mediumVehicleRate;
    }
    if (truck.vehicleType === "Heavy Vehicle") {
      rate = settings.heavyVehicleRate;
    }

    const updatedTruck = await Truck.updateById(req.params.id, {
      exitTime,
      amount: days * rate,
      paymentMethod: req.body.paymentMethod || "Cash",
      status: "Exited",
    });

    res.json({
      success: true,
      truck: updatedTruck,
      days,
      rate,
      amount: updatedTruck.amount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createTruck,
  getTruckByNumber,
  exitTruck,
  getReports,
};