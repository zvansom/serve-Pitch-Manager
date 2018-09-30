const mongoose = require('mongoose');
const Pitch = mongoose.model('Pitch');

exports.addPitch = (req, res) => {
  res.render('editPitch', { title: 'Add a Pitch' })
}

exports.createPitch = async (req, res) => {
  req.body.author = req.user._id;
  const pitch = await (new Pitch(req.body)).save();
  req.flash('success', `Created ${pitch.title}.`);
  res.redirect(`/pitch/${pitch.slug}`);
}

exports.getPitches = async (req, res) => {
  const pitches = await Pitch.find();
  res.render('pitches', { title: 'Pitches', pitches });
}

const confirmOwner = (pitch, user) => {
  if (!pitch.author.equals(user._id)) {
    throw Error('You must be the author of the pitch in order to edit it.');
  }
};

exports.editPitch = async (req, res) => {
  const pitch = await Pitch.findOne({ _id: req.params.id });
  confirmOwner(pitch, req.user);
  res.render('editPitch', { title: `Edit ${pitch.title}`, pitch })
}

exports.updatePitch = async (req, res) => {
  const pitch = await Pitch.findOneAndUpdate({ _id: req.params.id }, req.body, 
    { 
    new: true,
    runValidators: true,
   }).exec();
   req.flash('success', `Successfully updated <strong>${pitch.title}</strong> <a href="pitches/$pitch.slug}">View Pitch </a> `);
   res.redirect(`/pitches/${pitch._id}/edit`);
}

// ! WHEN TRANSITION TO DECOUPLED:
// ! Remove the catch for !pitch. Send null response to AJAX
// ! Handle null condition client side
exports.getPitchBySlug = async (req, res, next) => {
  const pitch = await Pitch.findOne({ slug: req.params.slug })
    .populate('author');
  if (!pitch) return next();
  res.render('pitch', { title: pitch.title, pitch });
}