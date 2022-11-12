const mongoose = require('mongoose');
const { Schema } = mongoose;


const visitationSchema = new Schema({
    id :  { type: String, required: true,  },
    user_id :  { type: String,  },
    orphan_id :  { type: String,   },
    date :  { type: Date,   },
    purpose :  { type: String,   },
    status: { type: String, default: 'pending' },
    deleted: { type: Boolean, default: 'false' },
  
  });

module.exports = mongoose.model('Visitation', visitationSchema);