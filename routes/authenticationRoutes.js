const router = require("express").Router();
const passport = require("passport");

// handle :/auth/ routes here
// Use passport.authenticate(), specifying the 'google' strategy, to authenticate requests.
router.get("/google", 
    passport.authenticate("google"));

router.get("/google/dashboard", 
    passport.authenticate("google", { failureRedirect: "/" }), 
        function (req, res) {  
            // Successful authentication, redirect dashboard.
            res.redirect("/dashboard");
    }
);

module.exports = router;