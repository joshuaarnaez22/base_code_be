const mongoose = require('mongoose');
let bcrypt = require('bcryptjs');
const { Schema } = mongoose;


const landingPageSchema = new Schema({
    id :  { type: String, required: true,  },
    date :  { type: Date, required: true,  },
    information :  { type: String,  },
    services :  [
        {
            name : { type: String,  }
        }
    ],
    status :    { type: Boolean, default : true },
    trusted_agency : [
        {
            name: { type: String  }
        }
    ],
    contact_number :  { type: Number,  },
    email :  { type: String,  },
    address :  { type: String,  },
    dateAdded :  { type: Date, default: new Date()  },
  });

  
module.exports = mongoose.model('landingpage', landingPageSchema);

