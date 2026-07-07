const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let users = [];
let forceWin = false;  // Server control

// Signup
app.post('/auth/signup', (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) return res.status(400).json({ message: "Name and email required" });

  const userId = Math.floor(1000 + Math.random() * 9000);
  users.push({ id: userId, name, email, balance: 0 });
  res.json({ id: userId, success: true });
});

// Get users
app.get('/users', (req, res) => res.json(users));

// Update balance
app.post('/update-balance', (req, res) => {
  const { id, balance } = req.body;
  const user = users.find(u => u.id == id);
  if (user) {
    user.balance = Number(balance);
    res.json({ success: true });
  } else res.status(404).json({ message: "User not found" });
});

// Force Win Endpoints
app.get('/force-win-status', (req, res) => {
  res.json({ forceWin });
});

app.post('/set-force-win', (req, res) => {
  forceWin = Boolean(req.body.forceWin);
  res.json({ success: true, forceWin });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
