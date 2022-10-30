const mongoose = require('mongoose');
const email = require('./validators/user-validators');
const username = require('./validators/user-validators');
const password = require('./validators/user-validators');
const { Schema } = mongoose;
let bcrypt = require('bcryptjs');


const fosterSchema = new Schema({
    id :  { type: String, required: true,  },
    firstname :  { type: String, default: '' },
    lastname :  { type: String,   default: '' },
    address :  { type: String,  default: '' },
    email: { type: String, required: true,  lowercase: true, validate: email.emailValidator },
    username: { type: String, required: true,  lowercase: true, validate: username.usernameValidators },
    role: { type: String, required: true },
    status: { type: String, default: 'active' },
    deleted: { type: Boolean, default: false },
    password: { type: String, required: true, validate: password.passwordValidator }
  
  });

  fosterSchema.pre('save', function (next) {
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

  
module.exports = mongoose.model('Foster', fosterSchema);