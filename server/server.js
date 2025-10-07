const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 5000;
const USERS_FILE = path.join(__dirname, 'users.json');

app.use(cors());

app.use(express.json());

app.post('/api/signup', (req, res) => {
    const { username, password } = req.body;
    fs.readFile(USERS_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error("File read error:", err);
            return res.status(500).json({ success: false, message: 'Server error reading users file.' });
        }

        const users = JSON.parse(data);
        if (users[username]) {
            return res.status(400).json({ success: false, message: 'Username already exists.' });
        }

        users[username] = { password: password };
        fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error("File write error:", err);
                return res.status(500).json({ success: false, message: 'Server error saving new user.' });
            }
            res.status(201).json({ success: true, message: 'Signup successful! Please log in.' });
        });
    });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    fs.readFile(USERS_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error("File read error:", err);
            return res.status(500).json({ success: false, message: 'Server error reading users file.' });
        }

        const users = JSON.parse(data);

        if (users[username] && users[username].password === password) {
            res.status(200).json({ success: true, message: 'Login successful!' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid username or password.' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Gatekeeper server is running on http://localhost:${PORT}`);
});

