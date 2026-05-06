const express = require('express');
const cors = require('cors');
const contactRoutes = require('./routes/contact.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello World');
});

app.use('/', contactRoutes);

module.exports = app;
