const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const { postSchema } = require("./post");
const findOrCreate = require("mongoose-findorcreate");

//create schema 
const userSchema = new mongoose.Schema({
    googleId: {
        type: String
    },
    provider: {
        type: String,
        require: true
    },
    username: {
        type: String,
        minlength: 5
    },
    email: {
        type: String,
        required: true
    },
    profilePic: {
        type: String
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
        type: [{userId: String, username: String, emailHash: String, profilePic: String}]
    },
    following: {
        type: [{userId: String, username: String, emailHash: String, profilePic: String}]
    }
});

// create index to perform full text search 
// we will index username to search users
userSchema.index({
    username: "text",
    email: "text"
});

//plugin to userSchema
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

//export model
var User = new mongoose.model("User", userSchema);

// // check indexes created
// User.collection.getIndexes({full: true}).then(indexes=>{
//     console.log(indexes);
// }).catch(err=>{
//     console.log(err);
// });

module.exports = User;

