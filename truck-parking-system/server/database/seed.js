const bcrypt = require("bcryptjs");
const { getAsync, runAsync } = require("../config/db");

const seedUser = async (username, password, role) => {
  const existing = await getAsync(
    "SELECT * FROM users WHERE username = ?",
    [username]
  );

  if (!existing) {
    const hashed = await bcrypt.hash(password, 10);
    await runAsync(
      "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
      [username, hashed, role]
    );
    console.log(`✅ Seeded user: ${username}`);
  } else {
    console.log(`ℹ️ User already exists: ${username}`);
  }
};

const seed = async () => {
  await seedUser("admin", "admin123", "Admin");
  await seedUser("staff", "staff123", "Staff");
  process.exit(0);
};

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});