import React from "react";
import GoalCard from "./GoalCard";

const GoalSection = ({ title, goals, onStatusChange }) => {
  return (
    <section className="section">
      <h2>{title}</h2>
      <div className="grid">
        {goals.length === 0 ? (
          <p className="muted">No goals in this category yet.</p>
        ) : (
          goals.map((goal) => (
            <GoalCard key={goal._id} goal={goal} onStatusChange={onStatusChange} />
          ))
        )}
      </div>
    </section>
  );
};

export default GoalSection;
