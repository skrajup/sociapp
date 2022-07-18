const { ObjectId } = require("mongodb");
const User = require("../models/user"); //User model
const { Post, Commenter, Comment } = require("../models/post"); //Post model

const posts_id_get = (req, res)=>{
    res.set(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0'
    );
    
    if(!ObjectId.isValid(req.params.id)){
        console.log("an error ocurred");
        req.flash("errorMsg", "Requested post id is not valid!!!");
        res.redirect("/404");  
    }else{
        Post.findOne({_id: ObjectId(req.params.id)}, (err, post)=>{
            if(err){
                console.log(err);
                req.flash("errorMsg", "Requested post is not found!!!");
                res.redirect("/404");
            }else{
                if(post){
                    User.findOne({_id: post.postedBy})
                    .then(user=>{
                        res.render("single-post-screen.ejs", {post: post, poster_name: user.username, loggedId: req.user._id, user: req.user, successMsg: req.flash("successMsg"), errorMsg: req.flash("errorMsg")});
                    })
                    .catch(err=>{    
                        console.log(err); 
                        req.flash("errorMsg", "Requested post is not found!!!");
                        res.redirect("/404");  
                    });
                }else{
                    req.flash("errorMsg", "Requested post is not found!!!");
                    res.redirect("/404"); 
                }
            }
        });
    } 
}

const posts_id_update_get = (req, res)=>{
    res.set(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0'
    );

    if(!ObjectId.isValid(req.params.id)){
        req.flash("errorMsg", "Requested post id is not valid!!!");
        res.redirect("/404");
    }else{
        Post.findOne({_id: ObjectId(req.params.id)}, (err, post)=>{
            if(err){
                console.log(err);
                req.flash("errorMsg", "Requested post is not found!!!");
                res.redirect("/404");
            }else{
                if(post){
                    res.render("edit-post.ejs", {post: post, user: req.user, successMsg: req.flash("successMsg"), errorMsg: req.flash("errorMsg")});
                }else{
                    req.flash("errorMsg", "Requested post is not found!!!");
                    res.redirect("/404"); 
                }
            }
        });
    }
}

const posts_id_update_post = (req, res)=>{
    res.set(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0'
    );

    Post.updateOne({_id: ObjectId(req.params.id)}, {title: req.body.title, body: req.body.postContent})
    .then(updatedDocs=>{
        // also update in user posts 
        var index = req.user.posts.findIndex((post)=>(post._id).toString() === req.params.id);
        Post.findOne({_id: ObjectId(req.params.id)})
        .then(updatedPost=>{
            if(updatedPost){
                req.user.posts[index] = updatedPost;
                req.user.save()
                .then(()=>{
                    req.flash("successMsg", "Post updated successfully.");
                    res.redirect("/dashboard/profile");
                }).catch(err=>{
                    console.log(err); 
                    req.flash("errorMsg", "error occurred!!!"); 
                    res.redirect("/404");
                });
            }
        }).catch(err=>{
            console.log(err); 
            req.flash("errorMsg", "error occurred!!!"); 
            res.redirect("/404");
        }); 
    }).catch(err=>{
        console.log(err); 
        req.flash("errorMsg", "error occurred!!!"); 
        res.redirect("/404");
    });
}

const posts_id_delete_get = (req, res)=>{
    res.set(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0'
    );

    if(!ObjectId.isValid(req.params.id)){
        req.flash("errorMsg", "Requested post id is not valid!!!");
        res.redirect("/404");
    }else{
        Post.findOne({_id: ObjectId(req.params.id)}, (err, post)=>{
            if(err){
                console.log(err);
                req.flash("errorMsg", "Requested post is not found!!!");
                res.redirect("/404");
            }else{
                if(post){
                    // delete from user database by using post id
                    const index = req.user.posts.findIndex((post)=>{return (post._id).toString()===req.params.id;});
                    req.user.posts.splice(index, 1);
                    
                    req.user.save()
                    .then(()=>{
                        // delete from posts database
                        Post.deleteOne({_id: ObjectId(req.params.id)})
                        .then(()=>{
                            req.flash("successMsg", "Post has been successfully deleted."); 
                            res.redirect("/dashboard/profile");
                        }).catch(err=>{
                            console.log(err); 
                            req.flash("errorMsg", "error occurred!!!"); 
                            res.redirect("/404");
                        });
                    }).catch(err=>{
                        console.log(err); 
                        req.flash("errorMsg", "error occurred!!!"); 
                        res.redirect("/404");
                    });  
                }else{
                    req.flash("errorMsg", "Requested post is not found!!!");
                    res.redirect("/404"); 
                }
            }
        });
    }  
}

const posts_id_post_comment_get = (req, res)=>{
    res.set(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0'
    );

    const commenter = new Commenter({
        username: req.user.username,
        email: req.user.email,
        time: new Date().toLocaleDateString(),
        userId: ObjectId(req.user.id)
    });

    const comment = new Comment({
        user: commenter,
        body: req.body.commentBody
    });

    if(!ObjectId.isValid(req.params.id)){
        req.flash("errorMsg", "Requested post id is not valid!!!");
        res.redirect("/404");
    }else{
        comment.save().then(()=>{
            Post.findByIdAndUpdate(ObjectId(req.params.id), {"$push": {comments: comment}}, {"new": true})
            .then((updatedPost)=>{
                // console.log(updatedPost);
                User.findOne({_id: updatedPost.postedBy})
                .then(foundUser=>{
                    // console.log(foundUser);
                    var index = foundUser.posts.findIndex(post=>{return (post._id).toString() === req.params.id;});
                    foundUser.posts[index] = updatedPost;
                    foundUser.save().then(()=>{res.redirect("back");}).catch(err=>{console.log(err); res.redirect("/404");});
                }).catch(err=>{
                    console.log(err); 
                    req.flash("errorMsg", "error occurred!!!"); 
                    res.redirect("/404");
                });
            }).catch(err=>{
                console.log(err); 
                req.flash("errorMsg", "error occurred!!!"); 
                res.redirect("/404");
            });
        }).catch(err=>{
            console.log(err); 
            req.flash("errorMsg", "error occurred!!!"); 
            res.redirect("back");
        });
    }
}

module.exports = {
    posts_id_get,
    posts_id_update_get,
    posts_id_update_post,
    posts_id_delete_get,
    posts_id_post_comment_get
}