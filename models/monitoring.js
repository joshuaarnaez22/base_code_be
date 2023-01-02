const mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
const { Schema } = mongoose;


const monitoringSchema = new Schema({
      id :  { type: String, required: true,  },
      addedby :  { type: String, required: true,  },
      orphan_id :  { type: String, required: true,  },
      status :  { type: String, default : 'active'  },
      date :  { type: Date,  }, 
      deleted :  { type: Boolean, default : false  },
      education : { type: String,  }, 
      daily_health :  { name : { type: String,  }},
      chores : [

        { name : { type: String,  }}

      ], 
      action : { type: String,  },
      meal : { type: String,  }
  });

  
module.exports = mongoose.model('Monitoring', monitoringSchema);

