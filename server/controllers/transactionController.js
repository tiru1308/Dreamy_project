const Transaction = require("../models/Transaction");

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1, createdAt: -1 });
    return res.json(transactions);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch transactions", error: error.message });
  }
};

exports.createTransaction = async (req, res) => {
  try {
    const { amount, type, category, date, description } = req.body;

    if (!amount || !type || !category || !date) {
      return res.status(400).json({ message: "amount, type, category, and date are required" });
    }

    const transaction = await Transaction.create({
      userId: req.user.id,
      amount,
      type,
      category,
      date,
      description
    });

    return res.status(201).json(transaction);
  } catch (error) {
    return res.status(500).json({ message: "Failed to create transaction", error: error.message });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const updates = req.body;
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      updates,
      { new: true, runValidators: true }
    );

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.json(transaction);
  } catch (error) {
    return res.status(500).json({ message: "Failed to update transaction", error: error.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!transaction) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    return res.json({ message: "Transaction deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete transaction", error: error.message });
  }
};
