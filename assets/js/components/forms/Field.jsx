import React from 'react';

// - 
//name
// -Un label
// -
/**
 * Un field a besoin généralement d'un
 * - name
 * - value
 * - id
 * - label
 * - onChange
 * - placeholder
 * - type
 * - error 
 */
const Field = ({
  name,
  type = "text",
  label,
  value,
  onChange,
  placeholder = "",
  error = "",
}) => (
  <div className="form-group">
    <label htmlFor={name}>{label}</label>
    <input
      type={type}
      placeholder={placeholder || label}
      name={name}
      id={name}
      value={value}
      className={"form-control" + (error && " is-invalid")}
      onChange={onChange}
    />
    {error && <p className="invalid-feedback">{error}</p>}
  </div>
);

 
export default Field;