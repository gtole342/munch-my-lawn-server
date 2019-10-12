let mongoose = require('mongoose')
let bcrypt = require('bcryptjs')

let addressSchema = new mongoose.Schema({
  streetNumber: String,
  street: String,
  city: String,
  state: String,
  zipcode: String,
  longitude: String,
  latitude: String
})

let userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: String,
  email: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
    validate: {
      validator: (input) => {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(input);
      }
    }
  },
  chats: [String],
  isGoat: Boolean,
  phone: String,
  password: {
    type: String,
    required: true,
    minlength: 8,
    maxlength: 32
  },
  profilePic: String,
  profileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goat'
  },
  rating: Number,
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment'
  }],
  address: addressSchema
})

userSchema.pre('save', function(next){
  this.password = bcrypt.hashSync(this.password, 12)
  next()
})

userSchema.set('toJSON', {
  transform: (doc, user) => {
    delete user.password;
    return user;
  }
})

userSchema.methods.isAuthenticated = function(typePassword) {
  return bcrypt.compareSync(typePassword, this.password);
}

module.exports = mongoose.model('User', userSchema);
