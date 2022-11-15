const mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
const { Schema } = mongoose;


const historySchema = new Schema({
    id :  { type: String, required: true,  },
    date :  { type: Date, required: true,  },
    action :  { type: String,  },
    status :    { type: Boolean, default : true },
    createdBy : { type: String  },
  });

  
module.exports = mongoose.model('History', historySchema);

