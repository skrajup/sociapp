const router = require("express").Router();
const passport = require("passport");

// handle :/auth/ routes here
// Use passport.authenticate(), specifying the 'google' strategy, to authenticate requests.
// google OAuth2.0
router.get("/google", 
    passport.authenticate("google"));

router.get("/google/dashboard", 
    passport.authenticate("google", { failureRedirect: "/" }), 
        function (req, res) {  
            // Successful authentication, redirect dashboard.
            res.redirect("/dashboard");
    }
);

// facebook OAuth 2.0
router.get("/facebook", 
    passport.authenticate("facebook"));

router.get("/facebook/dashboard", 
    passport.authenticate("facebook", { failureRedirect: "/" }), 
        function (req, res) {  
            // Successful authentication, redirect dashboard.
            res.redirect("/dashboard");
    }
);

// twitter OAuth 1.0
router.get("/twitter",
  passport.authenticate("twitter"));

router.get("/twitter/dashboard", 
    passport.authenticate("twitter", { failureRedirect: "/" }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect("/dashboard");
    }
);

// github OAuth 1.0
router.get("/github",
  passport.authenticate("github", { scope: [ 'user:email' ] }));

router.get("/github/dashboard", 
    passport.authenticate("github", { failureRedirect: "/" }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect("/dashboard");
    }
);

// spotify OAuth 
router.get("/spotify",
  passport.authenticate("spotify", {
    scope: ['ugc-image-upload', 'user-read-email', 'user-read-private']
  }));

router.get("/spotify/dashboard", 
    passport.authenticate("spotify", { failureRedirect: "/" }),
    function(req, res) {
        // Successful authentication, redirect home.
        res.redirect("/dashboard");
    }
);


module.exports = router;