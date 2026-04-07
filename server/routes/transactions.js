const express = require("express");
const authMiddleware = require("../middleware/auth");
const {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction
} = require("../controllers/transactionController");

const router = express.Router();

router.use(authMiddleware);
router.get("/", getTransactions);
router.post("/", createTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);

module.exports = router;
