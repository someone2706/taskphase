
import React, { useState } from "react";

export const Edit = ({ index, initialText, updateTask, cancel }) => {
  const [input, setInput] = useState(initialText || "");

  const onSubmit = (e) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    updateTask(index, trimmed);   
  };

  return (
    <form className="task-input" onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Update task"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        autoFocus
      />
      <button type="submit">Update Task</button>
      <button type="button" onClick={() => cancel(index)}>Cancel</button>
    </form>
  );
};
