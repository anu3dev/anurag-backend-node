const express = require('express');
const cors = require('cors');
const contactRoutes = require('./routes/contact.routes');
const aiChatRoutes = require('./routes/ai-chat.routes');
const mergeResolverRoutes = require('./routes/merge-resolver.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/', contactRoutes);
app.use('/', aiChatRoutes);
app.use('/', mergeResolverRoutes);

module.exports = app;
