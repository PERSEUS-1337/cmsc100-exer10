import React from 'react';

function TextInput({ label, name, register, required, errors }) {
  return (
    <div>
      <label className="label">
        <span className="label-text text-white">{label}</span>
      </label>
      <input
        className="input w-full bg-primary rounded-2xl required:border-red-500 required:border-2"
        required={required}
        {...register(name, { required })}
      />
      <label className="label">
        <span className="label-text-alt text-warning">{errors?.message}</span>
      </label>
    </div>
  );
}

export default TextInput;
