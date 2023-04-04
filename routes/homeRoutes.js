const router = require("express").Router();
const passport = require("passport");// authentication
const homeControllers = require("../controllers/homeControllers");

// all home routes
router.get("/", homeControllers.home_index);
router.get("/T&C", homeControllers.privacy_page);
router.get("/404", homeControllers.error_page);
router.get("/sign-out", homeControllers.signout);
router.get("/reset_password", homeControllers.reset_password);
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
































