const express = require('express');
const router = express.Router();
const pitchController = require('../controllers/pitchController');
const { catchErrors } = require('../handlers/errorHandlers')

// Do work here
router.get('/', catchErrors(pitchController.getPitches));
router.get('/pitches', catchErrors(pitchController.getPitches));
router.get('/add', pitchController.addPitch);
router.post('/add', catchErrors(pitchController.createPitch));

module.exports = router;
