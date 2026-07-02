const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let users = [
  { id: 1, name: "Test User", email: "test@example.com", balance: 100000 }
];

// Get users for Admin
app.get('/users', (req, res) => {
  res.json(users);
});

// Update balance from Admin
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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
