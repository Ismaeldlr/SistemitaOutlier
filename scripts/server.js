const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Replace with your MySQL username
    password: '', // Replace with your MySQL password
    database: 'tasks_db',
});

// Ensure database connection
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL database.');
});

// Endpoint to get all tasks
app.get('/tasks', (req, res) => {
    const sql = 'SELECT * FROM tasks WHERE status = "active"';
    db.query(sql, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch tasks.' });
        }
        res.json(results);
    });
});

// Endpoint to add a new task
app.post('/tasks', (req, res) => {
    const { permalink, id1, id2, justification } = req.body;

    if (permalink && justification) {
        const sql = 'INSERT INTO tasks (permalink, id1, id2, justification) VALUES (?, ?, ?, ?)';
        db.query(sql, [permalink, id1 || null, id2 || null, justification], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to add task.' });
            }
            res.status(201).json({ message: 'Task added successfully!' });
        });
    } else {
        res.status(400).json({ error: 'Permalink and justification are required.' });
    }
});

// Endpoint to delete a task (mark as "Not Available")
app.delete('/tasks', (req, res) => {
    const { permalink } = req.body;

    if (!permalink) {
        return res.status(400).json({ error: 'Permalink is required.' });
    }

    const sql = 'UPDATE tasks SET status = "not available" WHERE permalink = ?';
    db.query(sql, [permalink], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete task.' });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Task not found.' });
        }
        res.json({ message: 'Task marked as Not Available.' });
    });
});

// File path for instructions.json
const instructionsFilePath = path.join(__dirname, 'instructions.json');

// Endpoint to get all instructions
app.get('/instructions', (req, res) => {
    fs.readFile(instructionsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading instructions file:', err);
            return res.status(500).json({ error: 'Failed to fetch instructions.' });
        }
        const instructions = JSON.parse(data || '[]');
        res.json(instructions);
    });
});

// Endpoint to save instructions
app.post('/instructions', (req, res) => {
    const { instructions } = req.body;

    if (!Array.isArray(instructions)) {
        return res.status(400).json({ error: 'Instructions should be an array.' });
    }

    fs.writeFile(instructionsFilePath, JSON.stringify(instructions, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Error writing instructions file:', err);
            return res.status(500).json({ error: 'Failed to save instructions.' });
        }
        res.json({ message: 'Instructions saved successfully!' });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
