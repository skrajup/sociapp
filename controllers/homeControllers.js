const User = require("../models/user"); //User model
const passport = require("passport");// authentication
const md5 = require("md5");// for gravatar's email hash generation


const home_index = (req, res)=>{
    res.render("homepage", {successMsg: req.flash("successMsg"), errorMsg: req.flash("errorMsg")});
}

const error_page = (req, res)=>{
    res.render("404", {errorMsg: req.flash("errorMsg")});
}

const signout = (req, res)=>{
    req.logout((err)=>{
        if(err){
            console.log(err);
        }else{
            req.flash("successMsg", "You have been successfully logged out.");
            res.redirect("/")
        }
    });
}

const signup = (req, res)=>{
    User.register(new User({username: req.body.username, email: req.body.email, emailHash: md5(req.body.email)}), req.body.password, function (err, user) {  
        if(err){
            console.log(err);
            req.flash("errorMsg", "error ocurred during signing up!!!");
            return res.redirect("/");
        }

        passport.authenticate("local")(req, res, function () {  
            req.flash("successMsg", "You have been successfully signed in.")
            res.redirect("/dashboard");
        });
    });
}

module.exports = {
    home_index,
    error_page,
    signout,
    signup
}