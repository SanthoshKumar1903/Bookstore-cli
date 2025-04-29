const mongoose = require("mongoose");
require('dotenv').config();
console.log(process.env.MONGO_URI);

async function connect() {
  console.log(process.env.MONGO_URI);
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");
  }   catch (error) {
    console.error("Error :",error);
  }
}

exports.ConnectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to Database");
  } catch (error) {
    mongoose.disconnect()
    process.exit(1)
  }
}

connect();
