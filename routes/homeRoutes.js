const express = require("express");
const passport = require("passport");// authentication
const homeControllers = require("../controllers/homeControllers");
const router = express.Router();

// all home routes
router.get("/", homeControllers.home_index);
router.get("/404", homeControllers.error_page);
router.get("/sign-out", homeControllers.signout);
router.post("/signup", homeControllers.signup);
router.post("/signin", passport.authenticate("local", { successReturnToOrRedirect: "/dashboard", failureRedirect: "/"}));

module.exports = router;





















// router.post("/signin", (req, res)=>{
//     req.flash("successMsg", "You have been successfully signed in.");
//     passport.authenticate("local", { successReturnToOrRedirect: '/dashboard', failureRedirect: "/"});
// });

// router.post("/signin", (req, res)=>{
//     passport.authenticate('local', (err, passportUser, info) => {
//         if(err) {
//             console.log(err);
//             req.flash("errorMsg", "error occurred");
//             res.redirect("back");
//         }
    
//         if(passportUser) {
//             req.flash("successMsg", "You have been successfully signed in.")
//             return res.redirect("/dashboard");
//         }else{
//             req.flash("errorMsg", "error occurred");
//             res.redirect("back");
//         }
//       })(req, res);
// });
































