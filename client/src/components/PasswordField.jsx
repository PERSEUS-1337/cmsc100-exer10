import React from 'react';

function PasswordField({ label, name, register, required, pattern, minLength, errors, trigger }) {
  return (
    <div>
      <label className="label">
        <span className="label-text text-white">{label}</span>
      </label>
      <input
        className="input w-full bg-primary rounded-2xl required:border-red-500 required:border-2"
        required={required}
        {...register(name, {
          required,
          pattern,
          minLength,
        })}
        onChange={() => trigger("password")}
      />
      <label className="label">
        <span className="label-text-alt text-warning">{errors?.message}</span>
      </label>
    </div>
  );
}

export default PasswordField;
