const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const pitchSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: 'Please enter a title.',
  },
  description: {
    type: String,
    trim: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'There must be an user.',
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
  },
});

module.exports = mongoose.model('Pitch', pitchSchema);