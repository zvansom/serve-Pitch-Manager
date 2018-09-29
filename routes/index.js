const express = require('express');
const router = express.Router();
const pitchController = require('../controllers/pitchController');
const { catchErrors } = require('../handlers/errorHandlers')

// Do work here
router.get('/', pitchController.homePage);
router.get('/add', pitchController.addPitch);
router.post('/add', catchErrors(pitchController.createPitch));

module.exports = router;
