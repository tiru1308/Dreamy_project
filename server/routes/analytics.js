const express = require("express");
const authMiddleware = require("../middleware/auth");
const {
  getDashboard,
  getCategoryBreakdown,
  getMonthlyExpenses
} = require("../controllers/analyticsController");

const router = express.Router();

router.use(authMiddleware);
router.get("/dashboard", getDashboard);
router.get("/categories", getCategoryBreakdown);
router.get("/monthly", getMonthlyExpenses);

module.exports = router;
