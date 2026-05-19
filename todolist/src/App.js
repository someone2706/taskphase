import { useState } from "react";
import Navbar from "./navbar";
import { Edit } from "./edit";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {faPenToSquare} from '@fortawesome/free-regular-svg-icons';

function App() {
  const title = "Add your tasks below";

  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return; 

    setTasks(prev => [...prev, { text: trimmed, done: false }]);
    setInput(""); 
  };

  const toggleDone = index => {
    setTasks(prev =>
      prev.map((t, i) => (i === index ? { ...t, done: !t.done } : t))
    );
  };

  const removeTask = index => {
    setTasks(prev => prev.filter((_, i) => i !== index));
  };

  const toggleEdit = (index, value = true) => {
    setTasks(prev => prev.map((t, i) => i === index ? { ...t, isEditing: value } : t));
  };

  const updateTask = (index, newText) => {
    setTasks(prev => prev.map((t, i) => i === index ? { ...t, text: newText, isEditing: false } : t));
  };

  return (
    <div className="App">
      <Navbar />
      <div className="content">
        <h1>{title}</h1>

        <div className="task-input">
          <input
            type="text"
            placeholder="Add your task here..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleAdd(); }}
          />
          <button id="task" onClick={handleAdd}>Add Task</button>
        </div>

        <div className="tasks">
          {tasks.length === 0 ? (
            <p>No tasks yet.</p>
          ) : (
            tasks.map((task, idx) => (
            <div className="task" key={idx}>
              <input
                className="check"
                type="checkbox"
                checked={task.done}
                onChange={() => toggleDone(idx)}
              />

              {task.isEditing ? (
                <Edit
                  index={idx}
                  initialText={task.text}
                  updateTask={updateTask}
                  cancel={() => toggleEdit(idx, false)}
                />
              ) : (
                <span
                  className="task-text"
                  style={{ textDecoration: task.done ? "line-through" : "none" }}
                  onDoubleClick={() => toggleEdit(idx, true)}
                >
                  {task.text}
                </span>
              )}

              <FontAwesomeIcon
                icon={faPenToSquare}
                className="icon"
                onClick={() => toggleEdit(idx, true)}
              />

              <FontAwesomeIcon
                icon={faTrash}
                className="icon"
                onClick={() => removeTask(idx)}
              />
            </div>
          ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
