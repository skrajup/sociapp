const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const { postSchema } = require("./post");

//create schema 
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: 5
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        minlength: 8
    },
    emailHash: {
        type: String
    },
    posts: {
        type: [postSchema]
    },  
    followers: {
        type: [{userId: String, username: String, emailHash: String}]
    },
    following: {
        type: [{userId: String, username: String, emailHash: String}]
    }
});

//plugin to userSchema
userSchema.plugin(passportLocalMongoose);

//export model
module.exports = new mongoose.model("User", userSchema);