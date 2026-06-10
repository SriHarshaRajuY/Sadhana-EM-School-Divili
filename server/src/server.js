const app = require("./app");
const env = require("./config/env");
const { connectDatabase, mongoose } = require("./config/database");

let server;

const start = async () => {
  await connectDatabase();

  server = app.listen(env.PORT, () => {
    console.log(`Sadhana School API listening on port ${env.PORT}.`);
  });
};

const shutdown = async (signal) => {
  console.log(`${signal} received. Shutting down gracefully.`);

  if (server) {
    server.close(async () => {
      await mongoose.connection.close(false);
      process.exit(0);
    });
    return;
  }

  await mongoose.connection.close(false);
  process.exit(0);
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

start().catch((error) => {
  console.error("Failed to start server.", error);
  process.exit(1);
});

