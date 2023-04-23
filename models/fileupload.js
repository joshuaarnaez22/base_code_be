const mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
const email = require('./validators/user-validators');
const username = require('./validators/user-validators');
const password = require('./validators/user-validators');
const { Schema } = mongoose;


const fileUpload = new Schema({
  id:                 { type:String,  required:true },
  source:             { type:String, maxlength:50, required:true },
  user_id:            { type:String,  required:true },
  for:                { type:String, maxlength:50, required:true },
  date_added:         { type:Date, required:true, required:true, default : new Date() },
  status:             { type:Boolean, default: true },
  filetype:             { type:String, default: ''},
  // added_by:           { type:Number, maxlength:7, required:true },
  });
  
module.exports = mongoose.model('File', fileUpload);