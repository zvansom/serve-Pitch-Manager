const mongoose = require('mongoose');
const Pitch = mongoose.model('Pitch');

exports.homePage = (req, res) => {
  res.render('index');
}

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
  console.log(pitches);
  res.render('pitches', { title: 'Pitches', pitches });
}