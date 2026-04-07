import { useEffect, useMemo, useState } from "react";
import Layout from "../components/Layout";
import { apiRequest } from "../utils/api";

const emptyForm = {
  amount: "",
  type: "expense",
  category: "food",
  date: new Date().toISOString().slice(0, 10),
  description: ""
};

const Dashboard = () => {
  const [form, setForm] = useState(emptyForm);
  const [transactions, setTransactions] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);
  const [stats, setStats] = useState({ balance: 0, totalIncome: 0, totalExpense: 0, recentTransactions: [] });
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const [summary, txns, category, monthly, suggestionResponse] = await Promise.all([
        apiRequest("/analytics/dashboard"),
        apiRequest("/transactions"),
        apiRequest("/analytics/categories"),
        apiRequest("/analytics/monthly"),
        apiRequest("/suggestions")
      ]);

      setStats(summary);
      setTransactions(txns);
      setCategoryData(category);
      setMonthlyData(monthly);
      setSuggestions(suggestionResponse.suggestions || []);
    } catch (error) {
      setFeedback(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const submitTransaction = async (event) => {
    event.preventDefault();
    setFeedback("");

    const payload = {
      ...form,
      amount: Number(form.amount)
    };

    try {
      if (editingId) {
        await apiRequest(`/transactions/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
        setFeedback("Transaction updated");
      } else {
        await apiRequest("/transactions", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        setFeedback("Transaction added");
      }

      setForm(emptyForm);
      setEditingId(null);
      fetchData();
    } catch (error) {
      setFeedback(error.message);
    }
  };

  const startEdit = (transaction) => {
    setEditingId(transaction._id);
    setForm({
      amount: String(transaction.amount),
      type: transaction.type,
      category: transaction.category,
      date: transaction.date.slice(0, 10),
      description: transaction.description || ""
    });
  };

  const removeTransaction = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    await apiRequest(`/transactions/${id}`, { method: "DELETE" });
    fetchData();
  };

  const totals = useMemo(() => stats, [stats]);

  const totalCategory = categoryData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Layout>
      {feedback ? <p className="info">{feedback}</p> : null}

      <section className="summary-grid">
        <article className="summary-card"><h3>Balance</h3><p>${totals.balance.toFixed(2)}</p></article>
        <article className="summary-card"><h3>Income</h3><p>${totals.totalIncome.toFixed(2)}</p></article>
        <article className="summary-card"><h3>Expenses</h3><p>${totals.totalExpense.toFixed(2)}</p></article>
      </section>

      <section className="grid section">
        <form className="card form" onSubmit={submitTransaction}>
          <h3>{editingId ? "Edit transaction" : "Add transaction"}</h3>
          <input type="number" step="0.01" min="0.01" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <input type="text" placeholder="Category (food, rent, transport...)" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
          <textarea rows="3" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <button className="button">{editingId ? "Update" : "Save"}</button>
        </form>

        <div className="card">
          <h3>Recent Transactions</h3>
          {loading ? <p>Loading...</p> : null}
          <ul className="list">
            {transactions.slice(0, 10).map((transaction) => (
              <li key={transaction._id} className="list-item">
                <div>
                  <strong>{transaction.category}</strong>
                  <p className="muted">{new Date(transaction.date).toLocaleDateString()} · {transaction.description || "No description"}</p>
                </div>
                <div>
                  <p className={transaction.type === "income" ? "text-green" : "text-red"}>
                    {transaction.type === "income" ? "+" : "-"}${transaction.amount.toFixed(2)}
                  </p>
                  <div className="inline-actions">
                    <button className="button button--ghost" onClick={() => startEdit(transaction)}>Edit</button>
                    <button className="button button--danger" onClick={() => removeTransaction(transaction._id)}>Delete</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="grid section">
        <article className="card chart-card">
          <h3>Category-wise Expenses</h3>
          {categoryData.map((item) => (
            <div key={item.category}>
              <div className="bar-row">
                <span>{item.category}</span>
                <span>${item.value.toFixed(2)}</span>
              </div>
              <div className="bar-track">
                <div className="bar-fill" style={{ width: `${totalCategory ? (item.value / totalCategory) * 100 : 0}%` }} />
              </div>
            </div>
          ))}
        </article>

        <article className="card chart-card">
          <h3>Monthly Expenses</h3>
          {monthlyData.map((item) => (
            <div key={item.month}>
              <div className="bar-row">
                <span>{item.month}</span>
                <span>${item.expense.toFixed(2)}</span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill bar-fill--purple"
                  style={{ width: `${monthlyData.length ? (item.expense / Math.max(...monthlyData.map((m) => m.expense), 1)) * 100 : 0}%` }}
                />
              </div>
            </div>
          ))}
        </article>
      </section>

      <section className="card section">
        <h3>AI Suggestions</h3>
        <ul>
          {suggestions.map((suggestion) => (
            <li key={suggestion}>{suggestion}</li>
          ))}
        </ul>
      </section>
    </Layout>
  );
};

export default Dashboard;
