require("dotenv").config({ quiet: true });
const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) throw new Error("Falta MONGO_URI en .env");

  await mongoose.connect(uri, {
    dbName: process.env.MONGO_DB_NAME,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 10000,
  });
  console.log("MongoDB conectado");
}

mongoose.connection.on("error", (err) => {
  console.error("Error de conexion:", err);
});

const disconnectDB = () => mongoose.disconnect();

module.exports = { connectDB, disconnectDB };
