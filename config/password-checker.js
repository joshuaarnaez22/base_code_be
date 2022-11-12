
let bcrypt = require('bcryptjs');

module.exports.checkPassword =  function (password, hash) {
     bcrypt.compare(password, hash);
}
   
