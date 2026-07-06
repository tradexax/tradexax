const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// In-memory users (for testing)
let users = [
  { id: 1, name: "Test User", email: "test@example.com", balance: 100000 }
];

// Get all users (for Admin)
app.get('/users', (req, res) => {
  res.json(users);
});

// Signup
app.post('/auth/signup', (req, res) => {
  const { name, email } = req.body;
  
  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  // Check if user already exists
  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const newUser = {
    id: users.length + 1,
    name,
    email,
    balance: 0
  };

  users.push(newUser);
  res.json({ id: newUser.id, message: "User created successfully" });
});

// Update balance (for Admin)
app.post('/update-balance', (req, res) => {
  const { id, balance } = req.body;
  const user = users.find(u => u.id == id);
  if (user) {
    user.balance = Number(balance);
    res.json({ success: true, user });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
