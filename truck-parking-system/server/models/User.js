const { getAsync, runAsync } = require("../config/db");

const findOne = async (query) => {
  const username = query.username?.toLowerCase();
  const params = [username];
  let sql = "SELECT * FROM users WHERE LOWER(username) = ?";

  if (query.role) {
    sql += " AND LOWER(role) = ?";
    params.push(query.role.toLowerCase());
  }

  sql += " LIMIT 1";
  return getAsync(sql, params);
};

const create = async (data) => {
  const now = new Date().toISOString();
  const result = await runAsync(
    `INSERT INTO users (name, username, password, role, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      data.name || "",
      data.username.toLowerCase(),
      data.password,
      data.role || "Staff",
      now,
      now,
    ]
  );

  return getAsync("SELECT * FROM users WHERE id = ?", [result.lastID]);
};

module.exports = {
  findOne,
  create,
};