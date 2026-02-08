import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { fetchWithAuth, getApiBase } from "../utils/api";

const CreateGoal = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "daily",
    priority: "medium",
    deadline: ""
  });
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    const response = await fetchWithAuth(`${getApiBase()}/goals`, {
      method: "POST",
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.message || "Unable to create goal");
      return;
    }

    navigate("/goals");
  };

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>Create Goal</h1>
          <p className="muted">Plan a goal with deadlines and priorities.</p>
        </div>
        <div className="header__actions">
          <Link className="button button--ghost" to="/goals">
            Back to Goals
          </Link>
        </div>
      </div>

      <div className="card">
        <form className="form" onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Goal title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />
          <select name="category" value={formData.category} onChange={handleChange}>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="long-term">Long-term</option>
            <option value="fitness">Fitness</option>
            <option value="study">Study</option>
            <option value="career">Career</option>
            <option value="personal">Personal</option>
          </select>
          <select name="priority" value={formData.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
          />
          {error && <p className="muted">{error}</p>}
          <button className="button" type="submit">
            Save Goal
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateGoal;
