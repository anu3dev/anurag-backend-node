const express = require('express');
const router = express.Router();
const mergeResolverController = require('../controllers/merge-resolver.controller');

router.post('/analyze-pr', mergeResolverController.analyzePR);
router.post('/stream-resolve', mergeResolverController.streamResolve);

module.exports = router;
