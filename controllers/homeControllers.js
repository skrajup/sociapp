const User = require("../models/user"); //User model
const passport = require("passport");// authentication
const md5 = require("md5");// for gravatar's email hash generation
const transport = require("../controllers/devControllers").transport;

const home_index = (req, res)=>{
    // console.log("authnticated: "+req.isAuthenticated());
    if(req.isAuthenticated()){
        res.redirect("/dashboard");
    }else{
        res.render("homepage", {successMsg: req.flash("successMsg"), errorMsg: req.flash("errorMsg")});
    }
}

const privacy_page = (req, res)=>{
    res.render("T&C", {successMsg: req.flash("successMsg"), errorMsg: req.flash("errorMsg")});
}

const error_page = (req, res)=>{
    res.render("404", {errorMsg: req.flash("errorMsg")});
}

const signout = (req, res)=>{
    if(req.isAuthenticated()){
        req.logout((err)=>{
            if(err){
                console.log(err);
            }else{
                req.flash("successMsg", "You have been successfully logged out.");
                res.redirect("/")
            }
        });
    }else{
        req.flash("errorMsg", "You have already been logged out.");
        res.redirect("/")
    }
    
}

const signup = (req, res)=>{
    User.register(new User({ provider: "self", username: req.body.username, email: req.body.email, emailHash: md5(req.body.email)}), req.body.password, function (err, user) {  
        if(err){
            console.log(err);
            req.flash("errorMsg", "username is not available!!!");
            return res.redirect("/");
        }

        passport.authenticate("local")(req, res, function () {  
            req.flash("successMsg", "You have been successfully signed in.");
            const mailOptions = {
                from: "SociApp Dev<devquartz3152@gmail.com>",
                to: req.body.email,
                subject: "Congratulations for creating SociApp account...",
                text: "Congratulations " + req.body.username + " for creating your brand new SociApp account. SociApp Developer wishes you for good experience with SociApp.",
                html: `<div><h2>Congratulations ${req.body.username}</h2><p>For creating your brand new SociApp account. </p><p>SociApp Developer wishes you for good experience with sociapp.</p><p>For more enquiry <a href='mailto:devquartz3152@gmail.com'>mail us</a></p><br><br><h5>Regards</h5><p>SociApp Developer<br>India</p></div>`
            };

            transport.sendMail(mailOptions).then(info=>{
                // console.log(info);
                res.redirect("/dashboard");
            }).catch(err=>{
                console.log(err);
                res.redirect("/dashboard");
            });
        });
    });
}

const reset_password = (req, res) => {
    res.render("reset_password.ejs");
}

module.exports = {
    home_index,
    privacy_page,
    error_page,
    signout,
    signup,
    reset_password
}