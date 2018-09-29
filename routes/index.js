const express = require('express');
const router = express.Router();
const pitchController = require('../controllers/pitchController');
const { catchErrors } = require('../handlers/errorHandlers')

// Do work here
router.get('/', catchErrors(pitchController.getPitches));

router.get('/pitches', catchErrors(pitchController.getPitches));
router.get('/pitches/:id/edit', catchErrors(pitchController.editPitch))

router.get('/pitch/:slug', catchErrors(pitchController.getPitchBySlug) )

router.get('/add', pitchController.addPitch);
router.post('/add', catchErrors(pitchController.createPitch));
router.post('/add/:id', catchErrors(pitchController.updatePitch));

module.exports = router;
