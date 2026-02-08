const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDb = require("./config/db");
const authRoutes = require("./routes/auth");
const goalRoutes = require("./routes/goals");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "AI Goal Tracker API" });
});

app.use("/auth", authRoutes);
app.use("/goals", goalRoutes);

const PORT = process.env.PORT || 5000;

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });
