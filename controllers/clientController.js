const mongoose = require('mongoose');
const Client = mongoose.model('Client');

exports.createClient = async (req, res) => {
  req.body.user = req.user._id;
  const client = await (new Client(req.body)).save();
  req.flash('success', `Created ${client.name}.`);
  res.redirect(`/`);
}