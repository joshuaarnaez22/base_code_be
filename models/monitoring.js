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
      daily_health : [

        { value : { type: String,  },
          label : { type: String,  }
        }

      ],
      chores : [

        { value : { type: String,  },
          label : { type: String,  }
        }

      ], 
      action : { type: String,  },
      meal : { type: String,  },
      dateAdded : {  type : Date, default: new Date() }
  });

  
module.exports = mongoose.model('Monitoring', monitoringSchema);

