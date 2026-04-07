// Beginner-friendly heuristic suggestion engine.
// If OPENAI_API_KEY is not configured, these rules still provide useful tips.
exports.generateSuggestions = (transactions) => {
  const expenses = transactions.filter((transaction) => transaction.type === "expense");

  if (expenses.length === 0) {
    return ["Great start! Add a few expense entries to receive personalized suggestions."];
  }

  const totalExpense = expenses.reduce((sum, item) => sum + item.amount, 0);
  const byCategory = expenses.reduce((acc, item) => {
    const key = item.category.toLowerCase();
    acc[key] = (acc[key] || 0) + item.amount;
    return acc;
  }, {});

  const sorted = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
  const suggestions = [];

  const [topCategory, topValue] = sorted[0];
  const topPercent = (topValue / totalExpense) * 100;
  if (topPercent >= 35) {
    suggestions.push(`You are spending too much on ${topCategory}. It is ${topPercent.toFixed(0)}% of your total expenses.`);
  }

  const transport = byCategory.transport || 0;
  if (transport / totalExpense > 0.2) {
    suggestions.push("Try reducing transport expenses by batching errands or using public transit more often.");
  }

  const food = byCategory.food || 0;
  if (food / totalExpense > 0.25) {
    suggestions.push("Food spending is high. Try meal planning for a few days each week.");
  }

  if (suggestions.length === 0) {
    suggestions.push("Nice work! Your spending is reasonably balanced this period.");
  }

  return suggestions;
};
