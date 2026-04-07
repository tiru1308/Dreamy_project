const Transaction = require("../models/Transaction");
const { generateSuggestions } = require("../utils/suggestionEngine");

exports.getSuggestions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });

    // Mock/heuristic path. You can connect OpenAI API here if needed.
    const suggestions = generateSuggestions(transactions);

    return res.json({ suggestions });
  } catch (error) {
    return res.status(500).json({ message: "Failed to generate suggestions", error: error.message });
  }
};
