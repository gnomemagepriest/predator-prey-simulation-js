import React from 'react';

const SettingField = ({ label, value, onChange, step = 1 }) => (
  <div className="param-field">
    <label>{label}</label>
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      step={step}
      min="0"
    />
  </div>
);

export default SettingField;