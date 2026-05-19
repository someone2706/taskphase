const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const FILE_PATH = "./tasks.json";

const readTasks = () => {
  const data = fs.readFileSync(FILE_PATH);
  return JSON.parse(data);
};

const writeTasks = (tasks) => {
  fs.writeFileSync(FILE_PATH, JSON.stringify(tasks, null, 2));
};


app.get("/tasks", (req, res) => {
  const tasks = readTasks();
  res.json(tasks);
});

app.post("/tasks", (req, res) => {
  const tasks = readTasks();

  const newTask = {
    id: Date.now(),
    text: req.body.text,
    done: false
  };

  tasks.push(newTask);
  writeTasks(tasks);

  res.json(newTask);
});

app.delete("/tasks/:id", (req, res) => {
  let tasks = readTasks();

  const id = Number(req.params.id);
  tasks = tasks.filter(task => task.id !== id);

  writeTasks(tasks);
  res.json({ message: "Task deleted" });
});

app.put("/tasks/:id", (req, res) => {
  let tasks = readTasks();
  const id = Number(req.params.id);

  tasks = tasks.map(task => {
    if (task.id === id) {
      return {
        ...task,
        text: req.body.text ?? task.text,
        done: req.body.done ?? task.done
      };
    }
    return task;
  });

  writeTasks(tasks);
  res.json({ message: "Task updated" });
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

