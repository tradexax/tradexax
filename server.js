const express = require('express');
const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST');
  next();
});

let users = [{ id: 7842, balance: 0 }];

app.get('/users', (req, res) => res.json(users));

app.post('/update-balance', (req, res) => {
  const { id, balance } = req.body;
  users[0].balance = Number(balance);
  res.send({ success: true });
});

app.listen(4000, () => console.log("Server running"));