const express = require('express');
const router = express.Router();
const pitchController = require('../controllers/pitchController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers')

// Do work here
router.get('/', catchErrors(pitchController.getPitches));

router.get('/pitches', catchErrors(pitchController.getPitches));
router.get('/pitches/:id/edit', catchErrors(pitchController.editPitch))

router.get('/pitch/:slug', catchErrors(pitchController.getPitchBySlug) )

router.get('/add', authController.isLoggedIn, pitchController.addPitch);
router.post('/add', catchErrors(pitchController.createPitch));
router.post('/add/:id', catchErrors(pitchController.updatePitch));

router.get('/login', userController.loginForm);
router.post('/login', authController.login);

router.get('/register', userController.registerForm);
// 1. Validate the registration data
// 2. Register the user
// 3. Log the user in
router.post('/register', 
  userController.validateRegister,
  userController.register,
  authController.login,
);

router.get('/logout', authController.logout);

router.get('/account', authController.isLoggedIn, userController.account);
router.post('/account', catchErrors(userController.updateAccount));
router.post('/account/forgot', catchErrors(authController.forgot));
router.get('/account/reset/:token', catchErrors(authController.reset));
router.post('/account/reset/:token', 
  authController.confirmedPasswords, 
  catchErrors(authController.update
));

module.exports = router;
