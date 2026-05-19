import "./App.css";
import { useState, useEffect } from "react";
import Edit from "./components/edit";

function App() {

  const title = "To-Do List";

  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/tasks")
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);

  const handleAdd = async () => {
    if (!input.trim()) return;

    const res = await fetch("http://localhost:5000/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input })
    });

    const newTask = await res.json();
    setTasks(prev => [...prev, newTask]);
    setInput("");
  };

  const toggleDone = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "PUT"
    });

    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const removeTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/${id}`, {
      method: "DELETE"
    });

    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const toggleEdit = (id, value = true) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, isEditing: value } : task
      )
    );
  };

 const updateTask = async (id, newText) => {

  await fetch(`http://localhost:5000/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: newText })
  });

  setTasks(prev =>
    prev.map(task =>
      task.id === id
        ? { ...task, text: newText, isEditing: false }
        : task
    )
  );
};


  return (
    <div className="App">
      <div className="content">
        <h1>{title}</h1>

        <div className="task-input">
          <input
            type="text"
            placeholder="Add your task here..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") handleAdd();
            }}
          />
          <button onClick={handleAdd}>Add Task</button>
        </div>

        <div className="tasks">
          {tasks.length === 0 ? (
            <p>No tasks yet.</p>
          ) : (
            tasks.map(task => (
              <div className="task" key={task.id}>

                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => toggleDone(task.id)}
                />

                {task.isEditing ? (
                  <Edit
                    id={task.id}
                    initialText={task.text}
                    updateTask={updateTask}
                    cancel={() => toggleEdit(task.id, false)}
                  />
                ) : (
                  <span
                    style={{
                      textDecoration:
                        task.done ? "line-through" : "none"
                    }}
                    onClick={() => toggleEdit(task.id, true)}
                  >
                    {task.text}
                  </span>
                )}

                <button onClick={() => toggleEdit(task.id, true)}>
                  Edit
                </button>

                <button onClick={() => removeTask(task.id)}>
                  Delete
                </button>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
