const express = require('express');
const router = express.Router();
const pitchController = require('../controllers/pitchController');

// Do work here
router.get('/', pitchController.homePage);
router.get('/add', pitchController.addPitch);

module.exports = router;
