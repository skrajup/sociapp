const express = require("express");
const passport = require("passport");// authentication
const connectEnsureLogin = require('connect-ensure-login');// authorization
const User = require("../models/user"); //User model
const { Post } = require("../models/post"); //Post model
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
// all dashboard routes
router.get("/dashboard", connectEnsureLogin.ensureLoggedIn("/"), (req, res)=>{
    // The below line was added so we couldn't display the "/home-dashboard" page
    // after we logged out using the "back" button of the browser, which
    // would normally display the browser cache and thus expose the
    // "/home-dashboard" page we want to protect.
    res.set(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0'
    );
    res.render("dashboard");
});

router.get("/dashboard/create", connectEnsureLogin.ensureLoggedIn("/"), (req, res)=>{
    res.set(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0'
    );
    res.render("create-post");
});

router.post("/dashboard/create", connectEnsureLogin.ensureLoggedIn("/"), (req, res)=>{
    console.log(req.user);
    res.set(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0'
    );
    const newPost = new Post({
        title: req.body.title,
        body: req.body.postContent,
        postedOn: Date.now()
    });

    newPost.save((err)=>{
        if(err){
            console.log(err);
        }else{
            // console.log(newPost);
            res.redirect("/dashboard");
        }
    });

    req.user.posts.push(newPost);
    req.user.save();
});

router.get("/dashboard/profile", connectEnsureLogin.ensureLoggedIn("/"), (req, res)=>{
    res.set(
        'Cache-Control',
        'no-cache, private, no-store, must-revalidate, max-stal e=0, post-check=0, pre-check=0'
    );
    res.render("profile");
});

module.exports = router;