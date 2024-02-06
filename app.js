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
Exercise:
{
  username: "fcc_test",
  description: "test",
  duration: 60,
  date: "Mon Jan 01 1990",
  _id: "5fb5853f734231456ccb3b05"
}
Log:
{
  username: "fcc_test",
  count: 1,
  _id: "5fb5853f734231456ccb3b05",
  log: [{
    description: "test",
    duration: 60,
    date: "Mon Jan 01 1990",
  }]
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
    exercises: [],
  };

  users.push(user);

  return res.json({
    username: user.username,
    _id: user._id,
  });
});

app.get('/api/users', (req, res) => {
  return res.json(users);
});

app.post('/api/users/:_id/exercises', (req, res) => {
  const id = req.params._id;
  if (!req.body.description) {
    return res.json({'error': 'description is required'});
  }
  if (!Number(req.body.duration)) {
    return res.json({'error': 'duration is not correct'});
  }

  const date = req.body.date ? new Date(req.body.date) : new Date();
  const user = users.find(u => u._id === id);

  if (!user) {
    return res.json({'error': 'user is not found'});
  }

  const exercise = {
    date: date.toDateString(),
    duration: Number(req.body.duration),
    description: req.body.description,
  };

  user.exercises.push(exercise);

  return res.json({
    username: user.username,
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date,
    _id: user._id
  });
});

// ?[from][&to][&limit]
app.get('/api/users/:_id/logs', (req, res) => {
  const id = req.params._id;
  const from = req.query.from ? new Date(req.query.from) : null;
  const to = req.query.to ? new Date(req.query.to) : null;
  const limit = Number(req.query.limit);

  const user = users.find(u => u._id === id);
  if (!user) {
    return res.json({'error': 'user is not found'});
  }

  let logExercises = user.exercises.filter((exercise) =>  {
    const exerciseDate = new Date(exercise.date);

    if (from && to) {
      return from < exerciseDate && to > exerciseDate;
    } else if (from && !to) {
      return from < exerciseDate;
    } else if (!from && to) {
      return to > exerciseDate;
    } else if (!from && !to) {
      return true;
    }
  });

  if (limit) {
    logExercises = logExercises.slice(0, limit);
  }

  const result = {
    username: user.username,
    count: logExercises.length,
    _id: id,
    log: logExercises,
  };

  return res.json(result);
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
