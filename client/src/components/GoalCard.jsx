import React from "react";
import { Link } from "react-router-dom";

const GoalCard = ({ goal, onStatusChange }) => {
  return (
    <div className="card">
      <div className="card__header">
        <h3>{goal.title}</h3>
        <span className={`badge badge--${goal.priority}`}>{goal.priority}</span>
      </div>
      <p>{goal.description || "No description provided."}</p>
      <div className="card__meta">
        <span>Deadline: {new Date(goal.deadline).toLocaleDateString()}</span>
        <span className={`status status--${goal.status}`}>{goal.status}</span>
      </div>
      <div className="card__actions">
        <Link to={`/goals/${goal._id}`} className="button button--ghost">
          View Details
        </Link>
        {goal.status !== "completed" && (
          <button type="button" className="button" onClick={() => onStatusChange(goal)}>
            Mark Completed
          </button>
        )}
      </div>
    </div>
  );
};

export default GoalCard;
