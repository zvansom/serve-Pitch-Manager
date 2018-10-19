const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const pitchSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'There must be an user.',
  },
  title: {
    type: String,
    trim: true,
    required: 'Please enter a title.',
  },
  description: {
    type: String,
    trim: true,
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
  },
  datePitched: {
    type: Date,
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Pitch', pitchSchema);