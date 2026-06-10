const { hashPassword } = require("../services/authService");

const password = process.argv[2];

if (!password) {
  console.error("Usage: npm run hash:password -- \"your strong password\"");
  process.exit(1);
}

if (password.length < 10) {
  console.error("Password must be at least 10 characters long.");
  process.exit(1);
}

console.log(hashPassword(password));
