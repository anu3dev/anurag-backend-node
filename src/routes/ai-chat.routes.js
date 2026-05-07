const express = require('express');
const router = express.Router();
const aiChatController = require('../controllers/ai-chat.controller');

router.post('/prompt-based-ai-chat', aiChatController.handleChat);

module.exports = router;
