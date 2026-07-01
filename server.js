const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: "postgresql://postgres:WqfkYoCePIESWAZWEiSTwWTCqnhXQINA@postgres.railway.internal:5432/railway",
  ssl: { rejectUnauthorized: false }
});

// Initialize Database Table
async function initDB() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        balance NUMERIC DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log("✅ Database table ready");
  } catch (err) {
    console.error("❌ DB Error:", err);
  }
}
initDB();

// Signup Route
app.post('/auth/signup', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }
  try {
    const result = await pool.query(
      'INSERT INTO users (name, email, balance) VALUES ($1, $2, 0) RETURNING id',
      [name, email]
    );
    const userId = result.rows[0].id;
    console.log("New user created:", { id: userId, name, email });
    res.json({ id: userId, success: true });
  } catch (err) {
    res.status(500).json({ message: "Error creating user" });
  }
});

// Get all users for Admin
app.get('/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, email, balance FROM users ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update balance from Admin
app.post('/update-balance', async (req, res) => {
  const { id, balance } = req.body;
  try {
    await pool.query('UPDATE users SET balance = $1 WHERE id = $2', [balance, id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});