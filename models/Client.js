const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

// * Add Editor Name and Editor email and specific notes of client itself
const clientSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'You must provide a name.',
  },
  editor: {
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    }
  }
});

module.exports = mongoose.model('Client', clientSchema);