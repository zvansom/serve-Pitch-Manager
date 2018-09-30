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
  created: {
    type: Date,
    default: Date.now,
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'There must be an author.',
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
  },
});

pitchSchema.pre('save', async function(next) {
  if (!this.isModified('title')) return next();
  // Slug pattern: hyphen-separated-title-<num>
  // Num value increments and only displays on 2+
  this.slug = slug(this.title);
  // Find other stores that match this slug
  const slugRegEx = new RegExp(`^(${this.slug}((-[0-9]*$)?)$)`, 'i')
  const pitchesWithSlug = await this.constructor.find({ slug: slugRegEx });
  // If any results are returned from db, add the appropriate num value to slug
  if(pitchesWithSlug.length) {
    this.slug = `${this.slug}-${pitchesWithSlug.length + 1}`;
  }
  next();
});

module.exports = mongoose.model('Pitch', pitchSchema);