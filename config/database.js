
require('dotenv').config()
const crypto = require('crypto');
const { MongoClient, ServerApiVersion } = require('mongodb');

//const hash = crypto.createHmac(process.env.ENCRYPTION_ALGO, process.env.ENCRYPTION_KEY).update('thesis').digest(process.env.ENCRYPTION_ENCODING);

const hash = crypto.createHmac('sha256', secret)
                    
                   // updating data
                   .update('holy')
 
                   // Encoding to be used
                   .digest('hex');
 

module.exports = {

    //uri: process.env.DB_LOCAL,
    uri: process.env.DB_URL,
    secret: hash,
    options: {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        //serverApi: ServerApiVersion.v1
    },  

}


