const mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
const { Schema } = mongoose;


const monitoringSchema = new Schema({
      id :  { type: String, required: true,  },
      social_worker_id :  { type: String, required: true,  },
      orphan_id :  { type: String, required: true,  },
      status :  { type: String, default : 'active'  },
      deleted :  { type: Boolean, default : false  },
      education : { type: String,  }, 
      daily_health : { type: String,  },
      chores : { type: String,  }, 
      action : { type: String,  },
      meal : { type: Date,  }
  });

  
module.exports = mongoose.model('Monitoring', monitoringSchema);

