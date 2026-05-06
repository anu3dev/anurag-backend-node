const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact.controller');

router.post('/contact-through-website', contactController.handleContact);

module.exports = router;
