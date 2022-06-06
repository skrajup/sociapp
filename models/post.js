const mongoose = require("mongoose");
// const passportLocalMongoose = require("passport-local-mongoose");

//create post schema
const commenterSchema = new mongoose.Schema({
                            username: String,
                            email: String,
                            time: {
                                type: Date,
                                default: Date.now()
                            }
                        });


const commentSchema =   new mongoose.Schema({
                            user: commenterSchema,
                            body: {
                                type: String,
                                minlength: 5
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
                            type: Date,
                            default: Date.now(),
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

//export schemas
module.exports = { commenterSchema, commentSchema, postSchema };

//export models
module.exports = { Post };