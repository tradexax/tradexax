const express = require('express');
const cors = require('cors');
const fs = require('fs');
const app = express();

app.use(cors());
app.use(express.json());

const DATA_FILE = 'users.json';

// Load users from file (persistent)
let users = [];
if (fs.existsSync(DATA_FILE)) {
  try {
    users = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch (e) {
    console.log("Error loading users, starting fresh");
  }
}

let forceWin = false;

// Save users to file
function saveUsers() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
}

// Signup
app.post('/auth/signup', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ message: "Name and email required" });

  const existing = users.find(u => u.email === email);
  if (existing) return res.status(400).json({ message: "Email already exists" });

  const userId = Math.floor(1000 + Math.random() * 9000);
  const newUser = { id: userId, name, email, balance: 0 };
  users.push(newUser);
  saveUsers();   // Save to file
  res.json({ id: userId, success: true });
});

// Login
app.post('/auth/login', (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email === email);
  if (user) {
    res.json({ success: true, id: user.id });
  } else {
    res.status(401).json({ success: false, message: "Wrong email or password" });
  }
});

// Get users for Admin
app.get('/users', (req, res) => res.json(users));

// Update balance
app.post('/update-balance', (req, res) => {
  const { id, balance } = req.body;
  const user = users.find(u => u.id == id);
  if (user) {
    user.balance = Number(balance);
    saveUsers();   // Save to file
    res.json({ success: true });
  } else res.status(404).json({ message: "User not found" });
});

// Force Win
app.get('/force-win-status', (req, res) => res.json({ forceWin }));
app.post('/set-force-win', (req, res) => {
  forceWin = Boolean(req.body.forceWin);
  res.json({ success: true, forceWin });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
