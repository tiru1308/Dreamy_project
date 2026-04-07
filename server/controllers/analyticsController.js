const Transaction = require("../models/Transaction");

exports.getDashboard = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1, createdAt: -1 });

    const totalIncome = transactions
      .filter((transaction) => transaction.type === "income")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const totalExpense = transactions
      .filter((transaction) => transaction.type === "expense")
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    return res.json({
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      recentTransactions: transactions.slice(0, 5)
    });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load dashboard", error: error.message });
  }
};

exports.getCategoryBreakdown = async (req, res) => {
  try {
    const rows = await Transaction.aggregate([
      { $match: { userId: req.user._id, type: "expense" } },
      { $group: { _id: "$category", value: { $sum: "$amount" } } },
      { $sort: { value: -1 } }
    ]);

    return res.json(rows.map((item) => ({ category: item._id, value: Number(item.value.toFixed(2)) })));
  } catch (error) {
    return res.status(500).json({ message: "Failed to load category breakdown", error: error.message });
  }
};

exports.getMonthlyExpenses = async (req, res) => {
  try {
    const rows = await Transaction.aggregate([
      { $match: { userId: req.user._id, type: "expense" } },
      {
        $group: {
          _id: { year: { $year: "$date" }, month: { $month: "$date" } },
          total: { $sum: "$amount" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    const formatted = rows.map((item) => ({
      month: `${item._id.year}-${String(item._id.month).padStart(2, "0")}`,
      expense: Number(item.total.toFixed(2))
    }));

    return res.json(formatted);
  } catch (error) {
    return res.status(500).json({ message: "Failed to load monthly expenses", error: error.message });
  }
};
