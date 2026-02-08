import React, { useState } from "react";

const FeedbackModal = ({ goal, onClose, onSubmit, feedback }) => {
  const [explanation, setExplanation] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(explanation);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal__header">
          <h3>AI Goal Verification</h3>
          <button type="button" className="button button--ghost" onClick={onClose}>
            Close
          </button>
        </div>
        <p className="muted">Explain what you actually did to complete: {goal.title}</p>
        <form onSubmit={handleSubmit}>
          <textarea
            value={explanation}
            onChange={(event) => setExplanation(event.target.value)}
            rows="4"
            placeholder="Describe your progress..."
            required
          />
          <button type="submit" className="button">
            Evaluate with AI
          </button>
        </form>
        {feedback && (
          <div className="feedback">
            <h4>AI Feedback</h4>
            <p>{feedback.message}</p>
            <p>
              Completion: <strong>{feedback.percentage}%</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackModal;
