const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

// Require models
const User = mongoose.model('User');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  // No user found
  if(!user || !user.password) { 
    return res.status(403).send('User not found'); }

  // Validate user
  if(!user.authenticated(password)) {
    return res.status(401).send('Invalid Credentials.'); }

  // Valid user, give them a token
  const token = jwt.sign(user.toJSON(), process.env.JWT_SECRET, {
    expiresIn: 60 * 60 * 24, // Expires in 24 hours
  });

  // Send token and user
  res.send({ token });
}

exports.validateToken = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.send({ user });
};

// For future versions (?)
// exports.forgot = async (req, res) => {
//   // 1. See if a user with that email exists
//   const user = await User.findOne({ email: req.body.email });
//   if (!user) {
//     req.flash('success', `A password reset has been emailed to ${req.body.email}`);
//     return res.redirect('/login');
//   }
//   // 2. Set reset token and exiry on their account
//   // crypto is built in node.js module
//   user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
//   user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
//   await user.save();
//   // 3. Send them an email with the token
//   const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
//   await mail.send({
//     user,
//     subject: 'Password Reset',
//     resetURL,
//     filename: 'password-reset',
//   });
//   req.flash('success', `A password reset has been emailed.`)
//   // 4. Redirect to login page
//   res.redirect('/login');
// };

// For future versions (?)
// exports.reset = async (req, res) => {
//   const user = await User.findOne({ 
//     resetPasswordToken: req.params.token,
//     resetPasswordExpires: { $gt: Date.now() },
//   });
//   if (!user) {
//     req.flash('error', 'Password reset is invalid or has expired');
//     return res.redirect('/login');
//   }
//   res.render('reset', { title: 'Reset your password' });
// };

// exports.confirmedPasswords = (req, res, next) => {
//   if (req.body.password === req.body['password-confirm']) return next();
//   req.flash('error', 'Passwords do not match!');
//   res.redirect('back');
// };

// exports.update = async (req, res) => {
//   const user = await User.findOne({ 
//     resetPasswordToken: req.params.token,
//     resetPasswordExpires: { $gt: Date.now() },
//   });
//   if (!user) {
//     req.flash('error', 'Password reset is invalid or has expired');
//     return res.redirect('/login');
//   }
//   const setPassword = promisify(user.setPassword, user);
//   await setPassword(req.body.password);
//   user.resetPasswordToken = undefined;
//   user.resetPasswordExpires = undefined;
//   const updatedUser = await user.save();
//   await req.login(updatedUser);
//   req.flash('success', 'Your password has been reset. You are now logged in.');
//   res.redirect('/');
// };