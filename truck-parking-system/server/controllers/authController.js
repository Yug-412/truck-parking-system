const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Login
const login = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    const user = await User.findOne({
      username: username.toLowerCase(),
      role,
    });

    if (!user) {
      const existing = await User.findOne({
        username: username.toLowerCase(),
      });

      const message = existing
        ? `Account exists but is not registered as ${role}`
        : "Invalid Username or Role";

      return res.status(401).json({
        success: false,
        message,
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET || "SaiSamarthParkingSecret",
      {
        expiresIn: "7d",
      }
    );

    res.json({
      success: true,
      token,
      user: {
        name: user.name,
        username: user.username,
        role: user.role,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  login,
};