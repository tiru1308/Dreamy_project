const mongoose = require("mongoose");

const connectDb = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/ai-goal-tracker";
  await mongoose.connect(mongoUri, {
    autoIndex: true
  });
  console.log("MongoDB connected");
};

module.exports = connectDb;
