let mongoose = require('mongoose');
const Object_Id = mongoose.Schema.Types.ObjectId;

let messageSchema = new mongoose.Schema({
    sender: {
        type: Object_Id,
        ref: 'User',
    },
    message: {
        type: String,
    },
    date: {
        type: String,
    },
    recipient: {
        type: Object_Id,
        ref: 'User',
    },
    chatId: String
})


module.exports = mongoose.model('Message', messageSchema);