const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
// const passportLocalMongoose = require("passport-local-mongoose");

//create post schema
const commenterSchema = new mongoose.Schema({
                            username: String,
                            email: String,
                            time: {
                                type: String
                                // default: Date.now()
                            },
                            userId: mongoose.ObjectId
                        });


const commentSchema =   new mongoose.Schema({
                            user: commenterSchema,
                            body: {
                                type: String,
                                minlength: 5,
                                required: true
                            } 
                        });


const postSchema =  new mongoose.Schema({
                        title: {
                            type: String,
                            minlength: 10,
                            required: true
                        },
                        body: {
                            type: String,
                            minlength: 10,
                            required: true
                        },
                        postedOn: {
                            type: String,
                            // default: new Date().toLocaleDateString(),
                            required: true
                        },
                        postedBy: {
                            type: mongoose.ObjectId,
                            required: true
                        },
                        comments: [commentSchema]
                    });    

// plugin to Schemas
// commenterSchema.plugin(passportLocalMongoose);
// commentSchema.plugin(passportLocalMongoose);
// postSchema.plugin(passportLocalMongoose);

//models
const Post = new mongoose.model("Post", postSchema);
const Comment = new mongoose.model("Comment", commentSchema);
const Commenter = new mongoose.model("Commenter", commenterSchema);

//export schemas
module.exports = { commenterSchema, commentSchema, postSchema };

//export models
module.exports = { Post, Comment, Commenter };