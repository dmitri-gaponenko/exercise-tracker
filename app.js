const express = require('express');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 8081;
const cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));

app.use(express.urlencoded());

/* user:
{
  username: "fcc_test",
  _id: "5fb5853f734231456ccb3b05"
}
 */
const users = [];

app.post('/api/users', (req, res) => {
  const username = req.body.username;
  if (!username) {
    return res.json({'error': 'username is required'});
  }

  const user = {
    username: username,
    _id: crypto.randomUUID(),
  };

  users.push(user);

  return res.json(user);
});

app.get('/api/users', (req, res) => {
  return res.json(users);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
