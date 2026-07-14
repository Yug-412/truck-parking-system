const { allAsync, getAsync, runAsync } = require("../config/db");

const normalizeDate = (value) => {
  if (!value) {
    return null;
  }
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
};

const buildWhere = (query = {}, params = []) => {
  const clauses = [];

  if (query.truckNumber) {
    clauses.push("truckNumber = ?");
    params.push(query.truckNumber);
  }

  if (query.status) {
    clauses.push("status = ?");
    params.push(query.status);
  }

  const addDateRange = (field, criteria) => {
    if (!criteria) {
      return;
    }

    if (criteria.$gte !== undefined) {
      clauses.push(`${field} >= ?`);
      params.push(normalizeDate(criteria.$gte));
    }

    if (criteria.$lt !== undefined) {
      clauses.push(`${field} < ?`);
      params.push(normalizeDate(criteria.$lt));
    }

    if (criteria.$lte !== undefined) {
      clauses.push(`${field} <= ?`);
      params.push(normalizeDate(criteria.$lte));
    }
  };

  addDateRange("entryTime", query.entryTime);
  addDateRange("exitTime", query.exitTime);

  return clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
};

const buildOrder = (sort = {}) => {
  const keys = Object.keys(sort);
  if (keys.length === 0) {
    return "";
  }

  const field = keys[0];
  const direction = sort[field] === -1 ? "DESC" : "ASC";
  return `ORDER BY ${field} ${direction}`;
};

const findOne = async (query) => {
  const params = [];
  const where = buildWhere(query, params);
  return getAsync(`SELECT * FROM trucks ${where} LIMIT 1`, params);
};

const find = async (query = {}, sort = {}) => {
  const params = [];
  const where = buildWhere(query, params);
  const order = buildOrder(sort);
  return allAsync(`SELECT * FROM trucks ${where} ${order}`, params);
};

const countDocuments = async (query = {}) => {
  const params = [];
  const where = buildWhere(query, params);
  const row = await getAsync(
    `SELECT COUNT(*) AS count FROM trucks ${where}`,
    params
  );
  return row?.count || 0;
};

const create = async (data) => {
  const now = new Date().toISOString();
  const result = await runAsync(
    `INSERT INTO trucks (truckNumber, vehicleType, driverName, mobile, entryTime, exitTime, status, amount, paymentMethod, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.truckNumber.toUpperCase(),
      data.vehicleType,
      data.driverName || "",
      data.mobile || "",
      data.entryTime ? normalizeDate(data.entryTime) : now,
      data.exitTime ? normalizeDate(data.exitTime) : null,
      data.status || "Parked",
      data.amount ?? 0,
      data.paymentMethod || "Cash",
      now,
      now,
    ]
  );

  return getAsync("SELECT * FROM trucks WHERE id = ?", [result.lastID]);
};

const findById = async (id) => getAsync("SELECT * FROM trucks WHERE id = ?", [id]);

const updateById = async (id, data) => {
  const existing = await findById(id);
  if (!existing) {
    return null;
  }

  const updated = {
    truckNumber: data.truckNumber ?? existing.truckNumber,
    vehicleType: data.vehicleType ?? existing.vehicleType,
    driverName: data.driverName ?? existing.driverName,
    mobile: data.mobile ?? existing.mobile,
    entryTime: normalizeDate(data.entryTime ?? existing.entryTime),
    exitTime: data.exitTime !== undefined ? normalizeDate(data.exitTime) : existing.exitTime,
    status: data.status ?? existing.status,
    amount: data.amount ?? existing.amount,
    paymentMethod: data.paymentMethod ?? existing.paymentMethod,
    updatedAt: new Date().toISOString(),
  };

  await runAsync(
    `UPDATE trucks
     SET truckNumber = ?, vehicleType = ?, driverName = ?, mobile = ?, entryTime = ?, exitTime = ?, status = ?, amount = ?, paymentMethod = ?, updatedAt = ?
     WHERE id = ?`,
    [
      updated.truckNumber,
      updated.vehicleType,
      updated.driverName,
      updated.mobile,
      updated.entryTime,
      updated.exitTime,
      updated.status,
      updated.amount,
      updated.paymentMethod,
      updated.updatedAt,
      id,
    ]
  );

  return findById(id);
};

module.exports = {
  findOne,
  find,
  countDocuments,
  create,
  findById,
  updateById,
};