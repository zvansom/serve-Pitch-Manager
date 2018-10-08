const bcrypt = require('bcrypt');
const md5 = require('md5');
const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const validator = require('validator');

mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validator.isEmail, 'Invalid Email Address'],
    required: 'Please supply an email address',
  },
  name: {
    type: String,
    required: 'Please supply a name',
    trim: true,
  },
  password: {
    type: String,
    required: 'Please supply a password',
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
});

userSchema.set('toJSON', {
  transform(doc, user) {
    const returnJson = {
      id: user._id,
      email: user.email,
      name: user.name,
    };
    return returnJson;
  },
});

userSchema.methods.authenticated = function(password) {
  return bcrypt.compareSync(password, this.password);
};

userSchema.virtual('gravatar').get(function() {
  const hash = md5(this.email);
  return `https://gravatar.com/avatar/${hash}?s=200`;
});

userSchema.pre('save', function(next) {
  const hash = bcrypt.hashSync(this.password, 10);
  // store the hash as the user's password
  this.password = hash;
  next();
});

userSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('User', userSchema)