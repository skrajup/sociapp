const express = require("express");
const { ObjectId } = require("mongodb");
const passport = require("passport");// authentication
const connectEnsureLogin = require('connect-ensure-login');// authorization
const User = require("../models/user"); //User model
const { Post, Commenter, Comment } = require("../models/post"); //Post model
const router = express.Router();

// all home routes
router.get("/", (req, res)=>{
    res.render("homepage");
});

router.get("/sign-out", (req, res)=>{
    req.logout((err)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect("/")
        }
    });
});

router.post("/signup", (req, res)=>{
    User.register(new User({username: req.body.username, email: req.body.email}), req.body.password, function (err, user) {  
        if(err){
            console.log(err);
            return res.redirect("/");
        }

        passport.authenticate("local")(req, res, function () {  
            res.redirect("/dashboard");
        });
    });
});

router.post("/signin", passport.authenticate("local", { successReturnToOrRedirect: '/dashboard', failureRedirect: "/"}));


// after sign in
// all dashboard routes--------------------------------------------------------------
router.get("/dashboard", connectEnsureLogin.ensureLoggedIn("/"), (req, res)=>{
    // The below line was added so we couldn't display the "/home-dashboard" page
    // after we logged out using the "back" button of the browser, which
    // would normally display the browser cache and thus expose the
    // "/home-dashboard" page we want to protect.
    res.set(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0'
    );
    res.render("dashboard", {user: req.user});
});

router.get("/dashboard/create", connectEnsureLogin.ensureLoggedIn("/"), (req, res)=>{
    res.set(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0'
    );
    res.render("create-post");
});

router.post("/dashboard/create", connectEnsureLogin.ensureLoggedIn("/"), (req, res)=>{
    // console.log(req.user);
    res.set(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0'
    );
    const newPost = new Post({
        title: req.body.title,
        body: req.body.postContent,
        postedOn: new Date().toLocaleDateString(),
        postedBy: req.user._id
    });
    // console.log(newPost);

    newPost.save((err)=>{
        if(err){
            console.log(err);
            res.redirect("back");
        }else{
            // console.log(newPost);
            req.user.posts.push(newPost);
            req.user.save().then(()=>{res.redirect("/dashboard/profile");}).catch(err=>{console.log(err);});
        }
    });
});

router.get("/dashboard/profile", connectEnsureLogin.ensureLoggedIn("/"), (req, res)=>{
    res.set(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0'
    );
   
    res.render("profile", {user: req.user, classes: ["active", "", ""], loggedId: req.user._id});
});

// dashboard/profile routes
router.get("/dashboard/profile/followers", connectEnsureLogin.ensureLoggedIn("/"), (req, res)=>{
    // console.log(req);
    res.set(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0'
    );
    res.render("profile-followers.ejs", {user: req.user, classes: ["", "active", ""], loggedId: req.user._id});
});

router.get("/dashboard/profile/following", connectEnsureLogin.ensureLoggedIn("/"), (req, res)=>{
    res.set(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0'
    );
    res.render("profile-following.ejs", {user: req.user, classes: ["", "", "active"], loggedId: req.user._id});
});

// posts routes
router.get("/posts/:id", connectEnsureLogin.ensureLoggedIn("/"), (req, res)=>{
    res.set(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0'
    );
    
    if(!ObjectId.isValid(req.params.id)){
        res.render("404.ejs");
    }else{
        Post.findOne({_id: ObjectId(req.params.id)}, (err, post)=>{
            if(err){
                console.log(err);
                res.render("404.ejs");
            }else{
                if(post){
                    User.findOne({_id: post.postedBy})
                    .then(user=>{
                        res.render("single-post-screen.ejs", {post: post, poster_name: user.username, loggedId: req.user._id});
                    })
                    .catch(err=>{
                        console.log(err);   
                    });
                }else{
                    res.render("404.ejs"); 
                }
            }
        });
    }
    
});

router.get("/posts/:id/update", connectEnsureLogin.ensureLoggedIn("/"), (req, res)=>{
    res.set(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0'
    );

    if(!ObjectId.isValid(req.params.id)){
        res.render("404.ejs");
    }else{
        Post.findOne({_id: ObjectId(req.params.id)}, (err, post)=>{
            if(err){
                console.log(err);
                res.render("404.ejs");
            }else{
                if(post){
                    res.render("edit-post.ejs", {post: post});
                }else{
                    res.render("404.ejs"); 
                }
            }
        });
    }
});

router.post("/posts/:id/update", connectEnsureLogin.ensureLoggedIn("/"), (req, res)=>{
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
                    res.redirect("/dashboard/profile");
                })
                .catch(err=>{
                    console.log(err);
                    res.render("404");
                });
            }
        })
        .catch(err=>{
            console.log(err);
            res.render("404");
        }); 
    })
    .catch(err=>{
        console.log(err);
        res.render("404");
    });
});

router.get("/posts/:id/delete", connectEnsureLogin.ensureLoggedIn("/"), (req, res)=>{
    res.set(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0'
    );

    if(!ObjectId.isValid(req.params.id)){
        res.render("404.ejs");
    }else{
        Post.findOne({_id: ObjectId(req.params.id)}, (err, post)=>{
            if(err){
                console.log(err);
                res.render("404.ejs");
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
                            res.redirect("/dashboard/profile");
                        })
                        .catch(err=>{
                            console.log(err);
                            res.render("404.ejs"); 
                        });
                    })
                    .catch(err=>{
                        console.log(err);
                        res.render("404.ejs"); 
                    });
                    
                }else{
                    res.render("404.ejs"); 
                }
            }
        });
    }  
});

router.post("/posts/:id/post_comment", connectEnsureLogin.ensureLoggedIn("/"), (req, res)=>{
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
        res.render("404.ejs");
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
                    foundUser.save().then(()=>{res.redirect("back");}).catch(err=>{console.log(err); res.render("404");});
                }).catch(err=>{console.log(err); res.render("404");});
            }).catch(err=>{console.log(err); res.render("404");});
        }).catch(err=>{console.log(err); res.redirect("back");});
    }
});

// /users/:id: users route
router.get("/users/:id", connectEnsureLogin.ensureLoggedIn("/"), (req, res)=>{
    if(!ObjectId.isValid(req.params.id)){
        res.render("404");
    }else{
        if((req.user._id).toString() === req.params.id){
            res.redirect("/dashboard/profile");
        }else{
            User.findOne({_id: ObjectId(req.params.id)})
            .then(foundUser=>{
                res.render("home-guest", {user: foundUser});
            })
            .then(err=>{
                console.log(err);
                res.render("404");
            });
        }
    }
});

module.exports = router;


































