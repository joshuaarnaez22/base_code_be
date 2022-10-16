const mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
const email = require('../models/validators/user-validators');
const username = require('../models/validators/user-validators');
const password = require('../models/validators/user-validators');
const { Schema } = mongoose;


const userSchema = new Schema({
    id :  { type: String, required: true, unique: true, },
    email: { type: String, required: true, unique: true, lowercase: true, validate: email.emailValidator },
    username: { type: String, required: true, unique: true, lowercase: true, validate: username.usernameValidators },
    role: { type: String, required: true },
    status: { type: String, default: 'active' },
    deleted: { type: Boolean, default: false },
    password: { type: String, required: true, validate: password.passwordValidator }
  
  });


  userSchema.pre('save', function (next) {
    if (!this.isModified('password')) {
      return next()
    } else {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(this.password, salt, (err, hash) => {
          if (err) return next(err); // Ensure no errors
          this.password = hash; // Apply encryption to password
          next(err); // Exit middleware
        });
      });
    }
  })
  
  // (password) => ****does not work with es6 syntax**** use functions old ways
  userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password); // this return a promise
  }

  
module.exports = mongoose.model('User', userSchema);