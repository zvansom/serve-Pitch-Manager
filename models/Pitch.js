const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const pitchSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: 'Please enter a title.',
  },
  slug: String,
  description: {
    type: String,
    trim: true,
  },
});

pitchSchema.pre('save', function(next) {
  if (!this.isModified('title')) { return next(); }
  this.slug = slug(this.title);
  next();
});

module.exports = mongoose.model('Pitch', pitchSchema);