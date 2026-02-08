import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchWithAuth, getApiBase } from "../utils/api";

const GoalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [goal, setGoal] = useState(null);
  const [error, setError] = useState("");

  const loadGoal = async () => {
    const response = await fetchWithAuth(`${getApiBase()}/goals/${id}`);
    const data = await response.json();
    if (!response.ok) {
      setError(data.message || "Unable to load goal");
      return;
    }
    setGoal({ ...data, deadline: data.deadline.split("T")[0] });
  };

  useEffect(() => {
    loadGoal();
  }, [id]);

  const handleChange = (event) => {
    setGoal({ ...goal, [event.target.name]: event.target.value });
  };

  const handleSave = async (event) => {
    event.preventDefault();
    setError("");
    const response = await fetchWithAuth(`${getApiBase()}/goals/${id}`, {
      method: "PUT",
      body: JSON.stringify(goal)
    });
    if (!response.ok) {
      const data = await response.json();
      setError(data.message || "Unable to save goal");
      return;
    }
    navigate("/goals");
  };

  const handleDelete = async () => {
    await fetchWithAuth(`${getApiBase()}/goals/${id}`, { method: "DELETE" });
    navigate("/goals");
  };

  if (!goal) {
    return (
      <div className="container">
        <p className="muted">Loading goal...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>Edit Goal</h1>
          <p className="muted">Update details and status.</p>
        </div>
        <div className="header__actions">
          <Link className="button button--ghost" to="/goals">
            Back to Goals
          </Link>
        </div>
      </div>

      <div className="card">
        <form className="form" onSubmit={handleSave}>
          <input name="title" value={goal.title} onChange={handleChange} required />
          <textarea name="description" value={goal.description} onChange={handleChange} />
          <select name="category" value={goal.category} onChange={handleChange}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="long-term">Long-term</option>
            <option value="fitness">Fitness</option>
            <option value="study">Study</option>
            <option value="career">Career</option>
            <option value="personal">Personal</option>
          </select>
          <select name="priority" value={goal.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select name="status" value={goal.status} onChange={handleChange}>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="missed">Missed</option>
          </select>
          <input type="date" name="deadline" value={goal.deadline} onChange={handleChange} required />
          {error && <p className="muted">{error}</p>}
          <button className="button" type="submit">
            Save Changes
          </button>
          <button type="button" className="button button--ghost" onClick={handleDelete}>
            Delete Goal
          </button>
        </form>
      </div>
    </div>
  );
};

export default GoalDetails;
