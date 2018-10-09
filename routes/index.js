const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { catchErrors } = require('../handlers/errorHandlers')

router.post('/login', authController.login);
router.post('/register', 
  userController.validateRegister, // ? Is this doing anything for me?  Client side validation might make more sense.
  catchErrors(userController.register),
  catchErrors(authController.login),
);
router.post('/me/from/token', catchErrors(authController.validateToken));

// For future versions
// router.post('/account/forgot', catchErrors(authController.forgot));
// router.post('/account/reset/:token', 
//   authController.confirmedPasswords, 
//   catchErrors(authController.update),
// );

module.exports = router;
