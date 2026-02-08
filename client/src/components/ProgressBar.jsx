import React from "react";

const ProgressBar = ({ value }) => {
  return (
    <div className="progress">
      <div className="progress__fill" style={{ width: `${value}%` }} />
      <span className="progress__label">{value}%</span>
    </div>
  );
};

export default ProgressBar;
