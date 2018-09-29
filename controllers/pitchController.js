exports.homePage = (req, res) => {
  res.render('index');
}

exports.addPitch = (req, res) => {
  res.render('editPitch', { title: 'Add a Pitch' })
}