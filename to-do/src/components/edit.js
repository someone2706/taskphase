import { useState } from "react";

function Edit({ id, initialText, updateTask, cancel }) {

  const [value, setValue] = useState(initialText);

  const handleSave = () => {
    if (!value.trim()) return;
    updateTask(id, value);
  };

  return (
    <>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          if (e.key === "Escape") cancel();
        }}
      />

      <button onClick={handleSave}>Save</button>
      <button onClick={cancel}>Cancel</button>
    </>
  );
}

export default Edit;
