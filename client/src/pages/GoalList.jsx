import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import GoalSection from "../components/GoalSection";
import FeedbackModal from "../components/FeedbackModal";
import { fetchWithAuth, getAiBase, getApiBase } from "../utils/api";

const categories = [
  "daily",
  "weekly",
  "monthly",
  "long-term",
  "fitness",
  "study",
  "career",
  "personal"
];

const GoalList = () => {
  const [goals, setGoals] = useState([]);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({ category: "", status: "" });
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [aiFeedback, setAiFeedback] = useState(null);

  const loadGoals = async () => {
    setError("");
    const query = new URLSearchParams();
    if (filters.category) {
      query.append("category", filters.category);
    }
    if (filters.status) {
      query.append("status", filters.status);
    }

    const response = await fetchWithAuth(`${getApiBase()}/goals?${query.toString()}`);
    const data = await response.json();
    if (!response.ok) {
      setError(data.message || "Unable to fetch goals");
      return;
    }
    setGoals(data);
  };

  useEffect(() => {
    loadGoals();
  }, [filters.category, filters.status]);

  const goalsByCategory = useMemo(() => {
    return categories.reduce((acc, category) => {
      acc[category] = goals.filter((goal) => goal.category === category);
      return acc;
    }, {});
  }, [goals]);

  const handleStatusChange = (goal) => {
    setSelectedGoal(goal);
    setAiFeedback(null);
  };

  const handleAiSubmit = async (explanation) => {
    if (!selectedGoal) {
      return;
    }

    const response = await fetch(`${getAiBase()}/ai/evaluate-goal`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ goal: selectedGoal, user_explanation: explanation })
    });

    const data = await response.json();
    if (!response.ok) {
      setAiFeedback({ message: data.detail || "AI evaluation failed", percentage: 0 });
      return;
    }

    setAiFeedback({ message: data.feedback, percentage: data.completion_percentage });

    let nextStatus = "pending";
    if (data.completion_level === "fully_completed") {
      nextStatus = "completed";
    } else if (data.completion_level === "not_completed") {
      nextStatus = "missed";
    }

    await fetchWithAuth(`${getApiBase()}/goals/${selectedGoal._id}`, {
      method: "PUT",
      body: JSON.stringify({ status: nextStatus })
    });

    loadGoals();
  };

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>Goal List</h1>
          <p className="muted">Filter goals by category or status.</p>
        </div>
        <div className="header__actions">
          <Link className="button" to="/goals/create">
            + Create Goal
          </Link>
          <Link className="button button--ghost" to="/dashboard">
            Back to Dashboard
          </Link>
        </div>
      </div>

      <div className="card">
        <h3>Filters</h3>
        <div className="grid">
          <select
            value={filters.category}
            onChange={(event) => setFilters({ ...filters, category: event.target.value })}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option value={category} key={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(event) => setFilters({ ...filters, status: event.target.value })}
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="missed">Missed</option>
          </select>
        </div>
      </div>

      {error && <p className="muted">{error}</p>}

      {categories.map((category) => (
        <GoalSection
          key={category}
          title={category}
          goals={goalsByCategory[category] || []}
          onStatusChange={handleStatusChange}
        />
      ))}

      {selectedGoal && (
        <FeedbackModal
          goal={selectedGoal}
          onClose={() => setSelectedGoal(null)}
          onSubmit={handleAiSubmit}
          feedback={aiFeedback}
        />
      )}
    </div>
  );
};

export default GoalList;
