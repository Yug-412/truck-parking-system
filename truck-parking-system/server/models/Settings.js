const { getAsync, runAsync } = require("../config/db");

const findOne = async () =>
  getAsync("SELECT * FROM settings ORDER BY id LIMIT 1");

const create = async (data = {}) => {
  const now = new Date().toISOString();
  const settings = {
    companyName: data.companyName ?? "Sai Samarth Parking Service",
    ownerName: data.ownerName ?? "",
    mobile: data.mobile ?? "",
    address: data.address ?? "",
    lightVehicleRate: data.lightVehicleRate ?? 110,
    mediumVehicleRate: data.mediumVehicleRate ?? 150,
    heavyVehicleRate: data.heavyVehicleRate ?? 180,
    receiptFooter: data.receiptFooter ?? "Thank You! Visit Again.",
  };

  const result = await runAsync(
    `INSERT INTO settings (companyName, ownerName, mobile, address, lightVehicleRate, mediumVehicleRate, heavyVehicleRate, receiptFooter, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      settings.companyName,
      settings.ownerName,
      settings.mobile,
      settings.address,
      settings.lightVehicleRate,
      settings.mediumVehicleRate,
      settings.heavyVehicleRate,
      settings.receiptFooter,
      now,
      now,
    ]
  );

  return getAsync("SELECT * FROM settings WHERE id = ?", [result.lastID]);
};

const findByIdAndUpdate = async (id, data) => {
  const existing = await getAsync("SELECT * FROM settings WHERE id = ?", [id]);
  if (!existing) {
    return null;
  }

  const updatedAt = new Date().toISOString();
  const updated = {
    companyName: data.companyName ?? existing.companyName,
    ownerName: data.ownerName ?? existing.ownerName,
    mobile: data.mobile ?? existing.mobile,
    address: data.address ?? existing.address,
    lightVehicleRate: data.lightVehicleRate ?? existing.lightVehicleRate,
    mediumVehicleRate: data.mediumVehicleRate ?? existing.mediumVehicleRate,
    heavyVehicleRate: data.heavyVehicleRate ?? existing.heavyVehicleRate,
    receiptFooter: data.receiptFooter ?? existing.receiptFooter,
  };

  await runAsync(
    `UPDATE settings
     SET companyName = ?, ownerName = ?, mobile = ?, address = ?, lightVehicleRate = ?, mediumVehicleRate = ?, heavyVehicleRate = ?, receiptFooter = ?, updatedAt = ?
     WHERE id = ?`,
    [
      updated.companyName,
      updated.ownerName,
      updated.mobile,
      updated.address,
      updated.lightVehicleRate,
      updated.mediumVehicleRate,
      updated.heavyVehicleRate,
      updated.receiptFooter,
      updatedAt,
      id,
    ]
  );

  return getAsync("SELECT * FROM settings WHERE id = ?", [id]);
};

module.exports = {
  findOne,
  create,
  findByIdAndUpdate,
};