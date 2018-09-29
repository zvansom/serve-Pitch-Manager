const mongoose = require('mongoose');
const Pitch = mongoose.model('Pitch');

exports.addPitch = (req, res) => {
  res.render('editPitch', { title: 'Add a Pitch' })
}

exports.createPitch = async (req, res) => {
  const pitch = await (new Pitch(req.body)).save();
  req.flash('success', `Created ${pitch.title}.`);
  res.redirect(`/pitch/${pitch.slug}`);
}

exports.getPitches = async (req, res) => {
  const pitches = await Pitch.find()
  res.render('pitches', { title: 'Pitches', pitches });
}

exports.editPitch = async (req, res) => {
  const pitch = await Pitch.findOne({ _id: req.params.id });
  // TODO: Confirm user owns pitch
  res.render('editPitch', { title: `Edit ${pitch.title}`, pitch })
}

exports.updatePitch = async (req, res) => {
  const pitch = await Pitch.findOneAndUpdate({ _id: req.params.id }, req.body, 
    { 
    new: true,
    runValidators: true,
   }).exec();
   req.flash('success', `Successfully updated <strong>${pitch.title}</strong> <a href="pitches/$pitch.slug}">View Pitch </a> `)
   res.redirect(`/pitches/${pitch._id}/edit`);
}