import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";
import { fetchWithAuth, getApiBase } from "../utils/api";

const calculateStreak = (goals) => {
  const dailyCompleted = goals
    .filter((goal) => goal.category === "daily" && goal.status === "completed")
    .map((goal) => new Date(goal.deadline).toDateString());

  const uniqueDates = [...new Set(dailyCompleted)].sort((a, b) => new Date(b) - new Date(a));
  let streak = 0;
  let current = new Date();

  for (const dateString of uniqueDates) {
    const date = new Date(dateString);
    if (date.toDateString() === current.toDateString()) {
      streak += 1;
      current.setDate(current.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState([]);
  const [error, setError] = useState("");

  const loadGoals = async () => {
    const response = await fetchWithAuth(`${getApiBase()}/goals`);
    const data = await response.json();
    if (!response.ok) {
      setError(data.message || "Unable to load goals");
      return;
    }
    setGoals(data);
  };

  useEffect(() => {
    loadGoals();
  }, []);

  const total = goals.length;
  const completed = goals.filter((goal) => goal.status === "completed").length;
  const missed = goals.filter((goal) => goal.status === "missed").length;
  const completionPercentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  const categoryProgress = goals.reduce((acc, goal) => {
    if (!acc[goal.category]) {
      acc[goal.category] = { total: 0, completed: 0 };
    }
    acc[goal.category].total += 1;
    if (goal.status === "completed") {
      acc[goal.category].completed += 1;
    }
    return acc;
  }, {});

  const streak = calculateStreak(goals);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>Dashboard</h1>
          <p className="muted">Track your goals, progress, and AI feedback.</p>
        </div>
        <div className="header__actions">
          <Link className="button" to="/goals/create">
            + Create Goal
          </Link>
          <Link className="button button--ghost" to="/goals">
            View Goals
          </Link>
          <button className="button button--ghost" type="button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {error && <p className="muted">{error}</p>}

      <div className="summary-grid">
        <div className="summary-card">
          <h3>Total Goals</h3>
          <p>{total}</p>
        </div>
        <div className="summary-card">
          <h3>Completed Goals</h3>
          <p>{completed}</p>
        </div>
        <div className="summary-card">
          <h3>Missed Goals</h3>
          <p>{missed}</p>
        </div>
        <div className="summary-card">
          <h3>Completion Rate</h3>
          <ProgressBar value={completionPercentage} />
        </div>
        <div className="summary-card">
          <h3>Daily Streak</h3>
          <p>{streak} days</p>
        </div>
      </div>

      <section className="section">
        <h2>Category Progress</h2>
        <div className="grid">
          {Object.keys(categoryProgress).length === 0 && (
            <p className="muted">Create your first goal to see analytics.</p>
          )}
          {Object.entries(categoryProgress).map(([category, stats]) => {
            const percent = stats.total === 0 ? 0 : Math.round((stats.completed / stats.total) * 100);
            return (
              <div className="card" key={category}>
                <h3>{category}</h3>
                <p>
                  {stats.completed}/{stats.total} completed
                </p>
                <ProgressBar value={percent} />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
