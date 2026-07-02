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
      );
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `);
    console.log("✅ Database ready");
  } catch (err) {
    console.error("DB Error:", err);
  }
}
initDB();

// Force Win Setting
app.get('/settings/forcewin', async (req, res) => {
  try {
    const result = await pool.query("SELECT value FROM settings WHERE key = 'forceWin'");
    const isOn = result.rows[0] ? result.rows[0].value === 'true' : false;
    res.json({ forceWin: isOn });
  } catch (e) {
    res.json({ forceWin: false });
  }
});

app.post('/settings/forcewin', async (req, res) => {
  const { value } = req.body;
  try {
    await pool.query("INSERT INTO settings (key, value) VALUES ('forceWin', $1) ON CONFLICT (key) DO UPDATE SET value = $1", [value]);
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Other routes (signup, users, update-balance) remain the same
app.post('/auth/signup', async (req, res) => { /* ... your existing code ... */ });
app.get('/users', async (req, res) => { /* ... */ });
app.post('/update-balance', async (req, res) => { /* ... */ });

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`🚀 Server running on ${PORT}`));
