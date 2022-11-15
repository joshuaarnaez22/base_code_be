const mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
const { Schema } = mongoose;


const orphanSchema = new Schema({
    id :  { type: String, required: true,  },
    status :  { type: String, default : 'active'  },
    deleted :  { type: Boolean, default : false  },
    firstname :  { type: String, required : true },
    lastname :  { type: String, required : true },
    gender :  { type: String,  },
    age :  { type: Number,  },
    height :  { type: Number,  },
    weight :  { type: Number,  },
    waist :  { type: Number,  },
    dob :  { type: Date,  },
    place_of_birth :  { type: String,  },
    birth_status :  { type: String,  },
    present_whereabouts :  { type: String,  },
    place_where_found :  { type: String,  },
    date_admission :  { type: Date,  },
    date_surrendered :  { type: Date,  },
    category :  { type: String,  },
    souce_information :  { type: String,  },
    circumstances :  { type: String,  },
    background_info :  { type: String,  },
    desc_child_admission :  { type: String,  },
    dev_history :  { type: String,  },
    desc_present_envi :  { type: String,  },
    termination_rights_abandonement :  { type: String,  },
    assesement_recomendation :  { type: String,  },
    moral :  { type: String,  },
    // mointoring : [
    //     { 
    //       education : { type: String,  } 
    //     },
    //     { 
    //       daily_health : { type: String,  } 
    //     },
    //     { 
    //       chores : { type: String,  } 
    //     },
    //     { 
    //       action : { type: String,  } 
    //     },
    //     { 
    //       meal : { type: Date,  } 
    //     },
    // ],
  });

  
module.exports = mongoose.model('Orphan', orphanSchema);

