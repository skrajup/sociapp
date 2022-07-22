const mongoose = require("mongoose");

// message schema
const messageSchema = new mongoose.Schema({
    sender: {type: String, required: true},
    receiver: {type: String, required: true},
    message: {type: String, required: true, minlength: 1},
    type: {type: String, reuired: true},
    time: {type: String, required: true}
});

// model
const Message = new mongoose.model("message", messageSchema);

module.exports = Message;