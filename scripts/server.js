const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const filePath = path.join(require('os').homedir(), 'Desktop', 'tasks.txt');
const backupFilePath = path.join(require('os').homedir(), 'Desktop', 'backup.txt');

// Ensure backup file exists
if (!fs.existsSync(backupFilePath)) {
    fs.writeFileSync(backupFilePath, '', 'utf-8');
}

// Endpoint to get all tasks
app.get('/tasks', (req, res) => {
    if (!fs.existsSync(filePath)) {
        res.json([]);
        return;
    }
    const tasksData = fs.readFileSync(filePath, 'utf-8');
    const tasks = tasksData.split('---').filter(task => task.trim() !== '');
    res.json(tasks);
});

// Endpoint to add a new task
app.post('/tasks', (req, res) => {
    const { permalink, id1, id2, justification } = req.body;

    if (permalink && id1 && id2 && justification) {
        const newTask = `
${permalink}
${id1}
${id2}
${justification}
---
        `.trim();

        // Append task to tasks.txt
        fs.appendFileSync(filePath, `\n${newTask}`, 'utf-8');

        // Append task to backup.txt
        fs.appendFileSync(backupFilePath, `\n${newTask}`, 'utf-8');

        res.status(201).json({ message: 'Task added and backed up successfully!' });
    } else {
        res.status(400).json({ error: 'All fields are required.' });
    }
});

// Endpoint to delete a task (mark as "Not Available" in backup)
app.delete('/tasks', (req, res) => {
    const { permalink } = req.body;

    if (!permalink) {
        return res.status(400).json({ error: 'Permalink is required.' });
    }

    if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Task file not found.' });
    }

    const tasksData = fs.readFileSync(filePath, 'utf-8');
    const tasks = tasksData.split('---').filter(task => task.trim() !== '');

    // Find the task to delete
    const taskToDelete = tasks.find(task => task.includes(permalink));

    if (!taskToDelete) {
        return res.status(404).json({ error: 'Task not found.' });
    }

    // Mark the task as "Not Available" in backup.txt
    const backupData = fs.readFileSync(backupFilePath, 'utf-8');
    const updatedBackup = backupData
        .split('---')
        .map(task => {
            if (task.includes(permalink) && !task.includes('Not Available')) {
                return `${task.trim()}\nNot Available`;
            }
            return task.trim();
        })
        .join('\n---\n');
    fs.writeFileSync(backupFilePath, updatedBackup.trim() + '\n---\n', 'utf-8');

    // Remove the task from tasks.txt
    const updatedTasks = tasks.filter(task => !task.includes(permalink));
    const newData = updatedTasks.join('\n---\n');
    fs.writeFileSync(filePath, newData.trim() + '\n---\n', 'utf-8');

    res.status(200).json({ message: 'Task deleted and marked as Not Available in backup.' });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
