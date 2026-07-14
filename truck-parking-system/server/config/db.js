const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const bcrypt = require("bcryptjs");

const dbPath = path.join(__dirname, "..", "database", "truckParking.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ SQLite connection failed:", err.message);
    process.exit(1);
  }
  console.log("✅ SQLite connected:", dbPath);
});

const runAsync = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) {
        return reject(err);
      }
      resolve({ lastID: this.lastID, changes: this.changes });
    });
  });

const getAsync = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        return reject(err);
      }
      resolve(row);
    });
  });

const allAsync = (sql, params = []) =>
  new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        return reject(err);
      }
      resolve(rows);
    });
  });

const tableColumns = async (tableName) => {
  const rows = await allAsync(`PRAGMA table_info(${tableName})`);
  return rows.map((row) => row.name);
};

const ensureColumn = async (tableName, columnName, definition) => {
  const columns = await tableColumns(tableName);
  if (!columns.includes(columnName)) {
    await runAsync(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${definition}`);
  }
};

const createTables = async () => {
  await runAsync(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL DEFAULT '',
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'Staff',
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  await ensureColumn('users', 'name', "TEXT NOT NULL DEFAULT ''");
  await ensureColumn('users', 'username', 'TEXT NOT NULL');
  await ensureColumn('users', 'password', 'TEXT NOT NULL');
  await ensureColumn('users', 'role', "TEXT NOT NULL DEFAULT 'Staff'");
  await ensureColumn('users', 'createdAt', "TEXT NOT NULL DEFAULT (datetime('now'))");
  await ensureColumn('users', 'updatedAt', "TEXT NOT NULL DEFAULT (datetime('now'))");

  await runAsync(`
    CREATE TABLE IF NOT EXISTS settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      companyName TEXT NOT NULL DEFAULT 'Sai Samarth Parking Service',
      ownerName TEXT NOT NULL DEFAULT '',
      mobile TEXT NOT NULL DEFAULT '',
      address TEXT NOT NULL DEFAULT '',
      lightVehicleRate INTEGER NOT NULL DEFAULT 110,
      mediumVehicleRate INTEGER NOT NULL DEFAULT 150,
      heavyVehicleRate INTEGER NOT NULL DEFAULT 180,
      receiptFooter TEXT NOT NULL DEFAULT 'Thank You! Visit Again.',
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  await ensureColumn('settings', 'companyName', "TEXT NOT NULL DEFAULT 'Sai Samarth Parking Service'");
  await ensureColumn('settings', 'ownerName', "TEXT NOT NULL DEFAULT ''");
  await ensureColumn('settings', 'mobile', "TEXT NOT NULL DEFAULT ''");
  await ensureColumn('settings', 'address', "TEXT NOT NULL DEFAULT ''");
  await ensureColumn('settings', 'lightVehicleRate', 'INTEGER NOT NULL DEFAULT 110');
  await ensureColumn('settings', 'mediumVehicleRate', 'INTEGER NOT NULL DEFAULT 150');
  await ensureColumn('settings', 'heavyVehicleRate', 'INTEGER NOT NULL DEFAULT 180');
  await ensureColumn('settings', 'receiptFooter', "TEXT NOT NULL DEFAULT 'Thank You! Visit Again.'");
  await ensureColumn('settings', 'createdAt', "TEXT NOT NULL DEFAULT (datetime('now'))");
  await ensureColumn('settings', 'updatedAt', "TEXT NOT NULL DEFAULT (datetime('now'))");

  await runAsync(`
    CREATE TABLE IF NOT EXISTS trucks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      truckNumber TEXT NOT NULL,
      vehicleType TEXT NOT NULL,
      driverName TEXT NOT NULL DEFAULT '',
      mobile TEXT NOT NULL DEFAULT '',
      entryTime TEXT NOT NULL DEFAULT (datetime('now')),
      exitTime TEXT,
      status TEXT NOT NULL DEFAULT 'Parked',
      amount REAL NOT NULL DEFAULT 0,
      paymentMethod TEXT NOT NULL DEFAULT 'Cash',
      createdAt TEXT NOT NULL DEFAULT (datetime('now')),
      updatedAt TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  await ensureColumn('trucks', 'truckNumber', 'TEXT NOT NULL');
  await ensureColumn('trucks', 'vehicleType', 'TEXT NOT NULL');
  await ensureColumn('trucks', 'driverName', "TEXT NOT NULL DEFAULT ''");
  await ensureColumn('trucks', 'mobile', "TEXT NOT NULL DEFAULT ''");
  await ensureColumn('trucks', 'entryTime', "TEXT NOT NULL DEFAULT (datetime('now'))");
  await ensureColumn('trucks', 'exitTime', 'TEXT');
  await ensureColumn('trucks', 'status', "TEXT NOT NULL DEFAULT 'Parked'");
  await ensureColumn('trucks', 'amount', 'REAL NOT NULL DEFAULT 0');
  await ensureColumn('trucks', 'paymentMethod', "TEXT NOT NULL DEFAULT 'Cash'");
  await ensureColumn('trucks', 'createdAt', "TEXT NOT NULL DEFAULT (datetime('now'))");
  await ensureColumn('trucks', 'updatedAt', "TEXT NOT NULL DEFAULT (datetime('now'))");

  await runAsync(`CREATE INDEX IF NOT EXISTS idx_trucks_truckNumber ON trucks(truckNumber)`);
  await runAsync(`CREATE INDEX IF NOT EXISTS idx_trucks_status ON trucks(status)`);
};

const seedDefaultUsers = async () => {
  const existing = await getAsync("SELECT COUNT(*) AS count FROM users");
  if (existing?.count > 0) {
    return;
  }

  const now = new Date().toISOString();
  const adminPassword = await bcrypt.hash("admin123", 10);
  const staffPassword = await bcrypt.hash("staff123", 10);

  await runAsync(
    `INSERT OR IGNORE INTO users (name, username, password, role, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?)`,
    ["Administrator", "admin", adminPassword, "Admin", now, now]
  );

  await runAsync(
    `INSERT OR IGNORE INTO users (name, username, password, role, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?)`,
    ["Parking Staff", "staff", staffPassword, "Staff", now, now]
  );
};

createTables()
  .then(seedDefaultUsers)
  .catch((err) => {
    console.error("❌ Failed to initialize database:", err.message);
    process.exit(1);
  });

module.exports = {
  db,
  runAsync,
  getAsync,
  allAsync,
};