const mongoose = require('mongoose');
const User = mongoose.model('User');

exports.validateRegister = (req, res, next) => {
  // All methods on req are set on req in App.js from expressValidator
  req.sanitizeBody('name');
  req.checkBody('name', 'You must supply a name.').notEmpty();
  req.checkBody('email', 'That Email is not valid.').isEmail();
  req.sanitizeBody('email').normalizeEmail({
    remove_dots: false,
    remove_extension: false,
    gmail_remove_subaddress: false,
  });
  req.checkBody('password', 'Password cannot be blank.').notEmpty();
  req.checkBody('passwordConfirm', 'Confirmed password cannot be blank.').notEmpty();
  req.checkBody('passwordConfirm', 'Your passwords do not match.')
  .equals(req.body.password);
  
  const errors = req.validationErrors();
  if (errors) {
    return res.send({errors});
  }
  next();
};

exports.register = async (req, res, next) => {
  const { email, name, password } = req.body;
  const user = new User({ email, name, password });
  await user.save();
  next();
};

// For future versions
// exports.updateAccount = async (req, res) => {
//   const updates = {
//     name: req.body.name,
//     email: req.body.email,
//   };
//   const user = await User.findOneAndUpdate(
//     { _id: req.user._id },
//     { $set: updates },
//     { new: true, runValidators: true, context: 'query' },
//   );
//   res.send({ user })
// };