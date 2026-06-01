const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;
const TASKS_FILE = path.join(__dirname, 'tasks.json');

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to read tasks asynchronously
const readTasks = async () => {
  try {
    try {
      const data = await fs.readFile(TASKS_FILE, 'utf8');
      return JSON.parse(data || '[]');
    } catch (err) {
      if (err.code === 'ENOENT') {
        // File doesn't exist, create it with empty list
        await fs.writeFile(TASKS_FILE, JSON.stringify([]));
        return [];
      }
      throw err;
    }
  } catch (error) {
    console.error('Error reading tasks file:', error);
    return [];
  }
};

// Helper function to write tasks asynchronously
const writeTasks = async (tasks) => {
  try {
    await fs.writeFile(TASKS_FILE, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error('Error writing tasks file:', error);
  }
};

// Route: GET all tasks
app.get('/tasks', async (req, res) => {
  const tasks = await readTasks();
  res.json(tasks);
});

// Route: POST create task
app.post('/tasks', async (req, res) => {
  const { title, description, dueDate } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const tasks = await readTasks();
  const newTask = {
    id: crypto.randomUUID(),
    title: title.trim(),
    description: (description || '').trim(),
    dueDate: dueDate || null,
    completed: false,
    createdAt: new Date().toISOString()
  };

  tasks.push(newTask);
  await writeTasks(tasks);

  res.status(201).json(newTask);
});

// Route: PUT update task
app.put('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const { title, description, dueDate, completed } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required' });
  }

  const tasks = await readTasks();
  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks[index] = {
    ...tasks[index],
    title: title.trim(),
    description: (description || '').trim(),
    dueDate: dueDate || null,
    completed: completed === undefined ? tasks[index].completed : !!completed
  };

  await writeTasks(tasks);
  res.json(tasks[index]);
});

// Route: PATCH toggle complete/incomplete
app.patch('/tasks/:id/toggle', async (req, res) => {
  const { id } = req.params;
  const tasks = await readTasks();
  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks[index].completed = !tasks[index].completed;
  await writeTasks(tasks);

  res.json(tasks[index]);
});

// Route: DELETE task
app.delete('/tasks/:id', async (req, res) => {
  const { id } = req.params;
  const tasks = await readTasks();
  const index = tasks.findIndex(t => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }

  tasks.splice(index, 1);
  await writeTasks(tasks);

  res.json({ message: 'Task deleted successfully', id });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
