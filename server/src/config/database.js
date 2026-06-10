const mongoose = require("mongoose");
const env = require("./env");

const connectDatabase = async () => {
  mongoose.set("strictQuery", true);
  mongoose.set("bufferCommands", false);

  if (!env.MONGODB_URI) {
    console.warn("MONGODB_URI is not set. Database-backed APIs will return service-unavailable errors.");
    return false;
  }

  await mongoose.connect(env.MONGODB_URI, {
    autoIndex: env.NODE_ENV !== "production",
    serverSelectionTimeoutMS: 5000
  });

  console.log("MongoDB connected.");
  return true;
};

const isMongoConnected = () => mongoose.connection.readyState === 1;

module.exports = {
  connectDatabase,
  isMongoConnected,
  mongoose
};
