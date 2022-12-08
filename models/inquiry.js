const mongoose = require('mongoose');
const { Schema } = mongoose;

const inqurySchema = new Schema({

    id :  { type: String, required: true,  },
    name : { type: String,  },
    message : { type: String,  required : true},
    phone :  { type: Number,  },
    email : { type: String,  },
    status :    { type: Boolean, default : true },
    read :    { type: Boolean, default : false },
    deleted :    { type: Boolean, default : false },
    dateAdded :  { type: Date, default: new Date()  },


});

module.exports = mongoose.model('Inquiry', inqurySchema);