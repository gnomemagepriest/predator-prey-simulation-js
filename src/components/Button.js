import React from 'react';

const Button = ({ children, onClick, disabled = false }) => (
  <button
    className={`control-button ${disabled ? 'disabled' : ''}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

export default Button;