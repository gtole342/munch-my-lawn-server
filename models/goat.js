let mongoose = require('mongoose');
const Object_Id = mongoose.Schema.Types.ObjectId;


let goatSchema = new mongoose.Schema({
   user: {
       type: Object_Id, 
       required: true
   }
})

module.exports = mongoose.model('Goat', goatSchema);
