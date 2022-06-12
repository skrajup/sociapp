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

module.exports = {
    users_id_get
}