const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

const seedUsers = async () => {
  const admin = await User.findOne({
    username: "admin",
  });

  if (!admin) {
    const adminPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      name: "Administrator",
      username: "admin",
      password: adminPassword,
      role: "Admin",
    });
    console.log("✅ Admin Created");
  } else {
    console.log("ℹ️ Admin Already Exists");
  }

  const staff = await User.findOne({
    username: "staff",
  });

  if (!staff) {
    const staffPassword = await bcrypt.hash("staff123", 10);
    await User.create({
      name: "Parking Staff",
      username: "staff",
      password: staffPassword,
      role: "Staff",
    });
    console.log("✅ Staff Created");
  } else {
    console.log("ℹ️ Staff Already Exists");
  }

  process.exit();
};

seedUsers().catch((err) => {
  console.error(err);
  process.exit(1);
});