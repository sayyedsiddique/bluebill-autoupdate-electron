import React from "react";
import './LoadingSpinner.css';

const LoadingSpinner = (props) => {
  const {spinnerSize} = props

  return (
      <div className={`${spinnerSize === 'small' ? 'spinner-border-small text-secondary' : 'spinner-border text-secondary'}`} role="status">
        <span className="sr-only"></span>
      </div>
  );
};

export default LoadingSpinner;
