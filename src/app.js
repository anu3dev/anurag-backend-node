const express = require('express');
const userRoutes = require('./routes/user.routes');

const app = express();

app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/user', userRoutes);

module.exports = app;
