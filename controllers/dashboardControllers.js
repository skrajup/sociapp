const { Post } = require("../models/post"); //Post model
const user = require("../models/user");


const dashboard_index = (req, res)=>{
    // The below line was added so we couldn't display the "/home-dashboard" page
    // after we logged out using the "back" button of the browser, which
    // would normally display the browser cache and thus expose the
    // "/home-dashboard" page we want to protect.
    res.set(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0'
    );
    res.render("dashboard", {user: req.user, successMsg: req.flash("successMsg"), errorMsg: req.flash("errorMsg")});
}

const dashboard_create_get = (req, res)=>{
    res.set(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0'
    );
    res.render("create-post", {user: req.user, successMsg: req.flash("successMsg"), errorMsg: req.flash("errorMsg")});
}

const dashboard_create_post = (req, res)=>{
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
            req.flash("errorMsg", "Post can not be created!!!");
            res.redirect("back");
        }else{
            // console.log(newPost);
            req.user.posts.push(newPost);
            req.user.save()
            .then(()=>{
                req.flash("successMsg", "Post has been successfully created.");
                res.redirect("/dashboard/profile");
            }).catch(err=>{console.log(err);});
        }
    });
}

const dashboard_profile_get = (req, res)=>{
    res.set(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0'
    );
   
    res.render("profile", {user: req.user, classes: ["active", "", ""], loggedId: req.user._id, successMsg: req.flash("successMsg"), errorMsg: req.flash("errorMsg")});
}

const dashboard_profile_followers_get = (req, res)=>{
    // console.log(req);
    res.set(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0'
    );
    
    res.render("profile-followers.ejs", {user: req.user, classes: ["", "active", ""], loggedId: req.user._id, successMsg: req.flash("successMsg"), errorMsg: req.flash("errorMsg")});
}

const dashboard_profile_following_get = (req, res)=>{
    res.set(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0'
    );
    
    res.render("profile-following.ejs", {user: req.user, classes: ["", "", "active"], loggedId: req.user._id, successMsg: req.flash("successMsg"), errorMsg: req.flash("errorMsg")});
}

module.exports = {
    dashboard_index,
    dashboard_create_get,
    dashboard_create_post,
    dashboard_profile_get,
    dashboard_profile_followers_get,
    dashboard_profile_following_get
}
