
require("dotenv").config({ path: "api/.env" });
const jwt = require("jsonwebtoken");

const t = process.argv[2] || "";
if (!t) {
  console.error("Usage: node scripts/verify-token.js <JWT>");
  process.exit(2);
}
try {
  const decoded = jwt.verify(t, process.env.JWT_SECRET);
  console.log("OK ->", decoded);
} catch (e) {
  console.error("FAIL ->", e.message);
  process.exit(1);
}