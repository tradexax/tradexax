const express = require('express');
const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// In-memory storage (for now)
let users = [];

// Signup
app.post('/auth/signup', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  const userId = Math.floor(1000 + Math.random() * 9000);
  const newUser = { id: userId, name, email, balance: 10000 };
  users.push(newUser);

  console.log("New user created:", newUser);
  res.json({ id: userId, success: true });
});

// Get users (for admin)
app.get('/users', (req, res) => {
  res.json(users);
});

// Update balance (for admin)
app.post('/update-balance', (req, res) => {
  const { id, balance } = req.body;
  const user = users.find(u => u.id == id);
  if (user) {
    user.balance = Number(balance);
    res.json({ success: true });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});