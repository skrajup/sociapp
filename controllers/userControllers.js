const { ObjectId } = require("mongodb");
const User = require("../models/user"); //User model

const users_id_get = (req, res)=>{
    if(!ObjectId.isValid(req.params.id)){
        req.flash("errorMsg", "Requested user id is not valid!!!");
        res.redirect("/404");
    }else{
        if((req.user._id).toString() === req.params.id){
            res.redirect("/dashboard/profile");
        }else{
            User.findOne({_id: ObjectId(req.params.id)})
            .then(foundUser=>{
                if(foundUser){
                    res.render("home-guest", {user: req.user, foundUser: foundUser, successMsg: req.flash("successMsg"), errorMsg: req.flash("errorMsg")});
                }else{
                    req.flash("errorMsg", "Requested user does not exist!!!");
                    res.redirect("/404");
                }
            })
            .catch(err=>{
                console.log(err); 
                req.flash("errorMsg", "Requested user does not exist!!!");
                res.redirect("/404");
            });
        }
    }
}

const users_id_follow_get = (req, res)=>{
    if(!ObjectId.isValid(req.params.id)){
        req.flash("errorMsg", "Requested user id is not valid!!!");
        res.redirect("/404");
    }else{
        if((req.user._id).toString() === req.params.id){
            res.redirect("/dashboard/profile");
        }else{
            User.findOne({_id: ObjectId(req.params.id)})
            .then(foundUser=>{
                if(foundUser){
                    // check if not in following list already ?
                    if(req.user.following.findIndex(followed=>{return followed.username===foundUser.username}) != -1){
                        req.flash("errorMsg", "you already follow "+foundUser.username);
                        res.redirect("back");
                        return;
                    }else{
                        // otherwise
                        // add to the following of logged in user
                        req.user.following.push({userId: (foundUser._id).toString(), username: foundUser.username, emailHash: foundUser.emailHash, profilePic: foundUser.profilePic});
                        req.user.save().then(()=>{
                            //add to followers of next user
                            foundUser.followers.push({userId: (req.user._id).toString(), username: req.user.username, emailHash: req.user.emailHash, profilePic: req.user.profilePic});
                            foundUser.save().then(()=>{
                                // console.log(foundUser);
                                req.flash("successMsg", "You have successfully followed "+foundUser.username);
                                res.redirect("back");
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
                }else{
                    req.flash("errorMsg", "Requested user does not exist!!!");
                    res.redirect("/404");
                }
            })
            .catch(err=>{
                console.log(err); 
                req.flash("errorMsg", "Requested user does not exist!!!");
                res.redirect("/404");
            });
        }
    }
}

const users_id_unfollow_get = (req, res)=>{
    if(!ObjectId.isValid(req.params.id)){
        req.flash("errorMsg", "Requested user id is not valid!!!");
        res.redirect("/404");
    }else{
        if((req.user._id).toString() === req.params.id){
            res.redirect("/dashboard/profile");
        }else{
            User.findOne({_id: ObjectId(req.params.id)})
            .then(foundUser=>{
                if(foundUser){
                    // check if not in following list already ?
                    var idx = req.user.following.findIndex(followed=>{return followed.username===foundUser.username});
                    if(idx != -1){
                        // remove follower of that user
                        var idx2 = foundUser.followers.findIndex(follower=>{return follower.username===req.user.username});
                        if(idx2!=-1){
                            foundUser.followers.splice(idx2, 1);
                            foundUser.save().then(()=>{
                                req.user.following.splice(idx, 1);
                                req.user.save().then(()=>{
                                    req.flash("successMsg", "You unfollowed "+foundUser.username+" successfully");
                                    res.redirect("back");
                                    return;
                                }).catch((err)=>{
                                    console.log(err);
                                    req.flash("errorMsg", "error occurred!!!");
                                    res.redirect("/404");
                                });
                            }).catch((err)=>{
                                console.log(err);
                                req.flash("errorMsg", "error occurred!!!");
                                res.redirect("/404");
                            });
                        }else{
                            req.flash("errorMsg", "error occurred!!!");
                            res.redirect("back");
                        }
                    }else{
                        req.flash("errorMsg", "You do not follow "+foundUser.username);
                        res.redirect("back");
                    }
                }else{
                    req.flash("errorMsg", "Requested user does not exist!!!");
                    res.redirect("/404");
                }
            })
            .catch(err=>{
                console.log(err); 
                req.flash("errorMsg", "Requested user does not exist!!!");
                res.redirect("/404");
            });
        }
    }
}

module.exports = {
    users_id_get,
    users_id_follow_get,
    users_id_unfollow_get
}