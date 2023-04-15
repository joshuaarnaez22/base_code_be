const mongoose = require('mongoose');
const { Schema } = mongoose;


const visitationSchema = new Schema({
    id :  { type: String, required: true,  },
    user_id :  { type: String,  },
    orphan_id :  { type: String,   },
    date :  { type: Date,   },
    role :  { type: String,   },
    purpose :  { type: String,   },
    status: { type: String, default: 'pending' },
    deleted: { type: Boolean, default: 'false' },
    dateAdded : { type: Date, default : new Date() }
  
  });

module.exports = mongoose.model('Visitation', visitationSchema);