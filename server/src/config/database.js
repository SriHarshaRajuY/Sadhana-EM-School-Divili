const mongoose = require("mongoose");
const env = require("./env");

const connectDatabase = async () => {
  if (!env.MONGODB_URI) {
    console.warn("MONGODB_URI is not set. Content APIs will return empty public datasets.");
    return false;
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(env.MONGODB_URI, {
    autoIndex: env.NODE_ENV !== "production"
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
