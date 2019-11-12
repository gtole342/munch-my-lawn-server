require('dotenv').config();
let mongoose = require('mongoose')


console.log(process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/munch-my-lawn', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
})


module.exports.Message = require('./message')
module.exports.Goat = require('./goat')
module.exports.Review = require('./reviews')
module.exports.Appointment = require('./appointment')
module.exports.User = require('./user')
module.exports.Address = require('./address')

