const mongoose = require('mongoose');
const { Schema } = mongoose;


const scheduleSchema = new Schema({
    id :  { type: String, required: true,  },
    volunteer_id :  { type: String, required : true },
    schedule_date :  { type: String,   default: '' },
    schedule :  { type: String, enum: ['8am - 5pm', '8am - 12pm', '1pm - 5pm'] },
    status : { type: Boolean, default: true, },
    dateAdded : { type: Date,   default: new Date() }
  });

  
module.exports = mongoose.model('Schedule', scheduleSchema);
