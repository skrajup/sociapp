const passport = require("passport");// authentication
const User = require("../models/user"); //import User model
const md5 = require("md5");
const GoogleStrategy = require("passport-google-oauth20").Strategy;// google strategy
const FacebookStrategy = require("passport-facebook").Strategy; // facebook strategy
const TwitterStrategy = require("passport-twitter").Strategy;   // twitter strategy
const GithubStrategy = require("passport-github2").Strategy; // Githhub Strategy
const SpotifyStrategy = require("passport-spotify").Strategy; // Spotify Strategy

// passport strategy to login using user's google account by using OAuth 2.0 API
function GoogleStrategyConfig() {  
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/google/dashboard",
        scope: ['profile', 'email', 'openid']
    },  
    function verify(accessToken, refreshToken, profile, cb) {
        // findOrCreate function manual implementation
        // query into database to find google account exists or not
        // if not just create record and insert into database
        // otherwise just authenticate
        User.findOne({ googleId: profile.id, email: profile.emails[0].value })  // find user using googleId
            .then(userFound=>{  // if user search query is successful
                if(userFound){  // if user exists, means its not null
                    // console.log(userFound);
                    return cb(null, userFound);
                }else{  // if user does not exist at all, means if its null, then just create 
                    var profilePic = "";
                    if(profile.photos.length > 0){
                        profilePic = profile.photos[0].value;
                    }
                    const newUser = new User({  // new user 
                        googleId: profile.id,
                        provider: profile.provider,
                        username: profile.displayName,
                        email: profile.emails[0].value,
                        emailHash: md5(profile.emails[0].value),
                        profilePic: profilePic
                    });

                    newUser.save()  // save user credentials into the database
                        .then(ack=>{
                            // console.log(ack);
                            return cb(null, newUser);
                        })
                        .catch(err=>{
                            console.log(err);
                            return cb(err);
                        });
                }
            })
            .catch(err=>{   // if error occurred while finding the user into database
                console.log(err);
                return cb(err);
            }); 
        }
    ));
}

function FacebookStrategyConfig() {       
    // passport facebook strategy to login user via their fb account
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:3000/auth/facebook/dashboard",
        profileFields: ['id', 'displayName', 'photos', 'email', 'name', 'profileUrl', 'gender']
    },
    function verify(accessToken, refreshToken, profile, cb) {
        User.findOne({ facebookId: profile.id})  // find user using googleId
            .then(userFound=>{  // if user search query is successful
                if(userFound){  // if user exists, means its not null
                    // console.log(userFound);
                    return cb(null, userFound);
                }else{  // if user does not exist at all, means if its null, then just create 
                    var userEmail = "facebook@fb.com";
                    var gotEmail = profile._json.email;
                    if(typeof gotEmail !== "undefined" && gotEmail !== null && gotEmail !== ""){
                        userEmail = gotEmail;
                    }
                    var profilePic = "";
                    if(profile.photos.length > 0){
                        profilePic = profile.photos[0].value;
                    }
                    const newUser = new User({  // new user 
                        facebookId: profile.id,
                        provider: profile.provider,
                        username: profile.displayName,
                        email: userEmail,
                        emailHash: md5(userEmail),
                        profilePic: profilePic
                    });

                    newUser.save()  // save user credentials into the database
                        .then(ack=>{
                            // console.log(ack);
                            return cb(null, newUser);
                        })
                        .catch(err=>{
                            console.log(err);
                            return cb(err);
                        });
                }
            })
            .catch(err=>{   // if error occurred while finding the user into database
                console.log(err);
                return cb(err);
            }); 
        }
    ));
}

function TwitterStrategyConfig() {  
    // passport twitter strategy to login user 
    passport.use(new TwitterStrategy({
        consumerKey: process.env.TWITTER_CONSUMER_KEY,
        consumerSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: "http://localhost:3000/auth/twitter/dashboard"
    },
    function verify(token, tokenSecret, profile, cb) {
        User.findOne({ twitterId: profile.id})  // find user using googleId
            .then(userFound=>{  // if user search query is successful
                if(userFound){  // if user exists, means its not null
                    // console.log(userFound);
                    return cb(null, userFound);
                }else{  // if user does not exist at all, means if its null, then just create 
                    var userEmail = "twitter@tweet.com";
                    var gotEmail = profile._json.email;
                    if(typeof gotEmail !== "undefined" && gotEmail !== null && gotEmail !== ""){
                        userEmail = gotEmail;
                    }

                    var profilePic = "";
                    if(profile.photos.length > 0){
                        profilePic = profile.photos[0].value;
                    }
                    const newUser = new User({  // new user 
                        twitterId: profile.id,
                        provider: profile.provider,
                        username: profile.displayName,
                        email: userEmail,
                        emailHash: md5(userEmail),
                        profilePic: profilePic
                    });

                    newUser.save()  // save user credentials into the database
                        .then(ack=>{
                            // console.log(ack);
                            return cb(null, newUser);
                        })
                        .catch(err=>{
                            console.log(err);
                            return cb(err);
                        });
                }
            })
            .catch(err=>{   // if error occurred while finding the user into database
                console.log(err);
                return cb(err);
            }); 
        }
    ));
}

function GithubStrategyConfig() {
    // passport twitter strategy to login user 
    passport.use(new GithubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://127.0.0.1:3000/auth/github/dashboard/"
    },
    function verify(accessToken, refreshToken, profile, cb) {
        User.findOne({ githubId: profile.id})  // find user using googleId
            .then(userFound=>{  // if user search query is successful
                if(userFound){  // if user exists, means its not null
                    // console.log(userFound);
                    return cb(null, userFound);
                }else{  // if user does not exist at all, means if its null, then just create 
                    var userEmail = "github@git.com";
                    var gotEmail = profile._json.email;
                    if(typeof gotEmail !== "undefined" && gotEmail !== null && gotEmail !== ""){
                        userEmail = gotEmail;
                    }
                    var profilePic = "";
                    if(profile.photos.length > 0){
                        profilePic = profile.photos[0].value;
                    }
                    const newUser = new User({  // new user 
                        githubId: profile.id,
                        provider: profile.provider,
                        username: profile.displayName,
                        email: userEmail,
                        emailHash: md5(userEmail),
                        profilePic: profilePic
                    });

                    newUser.save()  // save user credentials into the database
                        .then(ack=>{
                            // console.log(ack);
                            return cb(null, newUser);
                        })
                        .catch(err=>{
                            console.log(err);
                            return cb(err);
                        });
                }
            })
            .catch(err=>{   // if error occurred while finding the user into database
                console.log(err);
                return cb(err);
            }); 
        }
    ));
}

function SpotifyStrategyConfig() {  
    passport.use(new SpotifyStrategy({
        clientID: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/auth/spotify/dashboard"
    },
        function verify(accessToken, refreshToken, expires_in, profile, cb) {  
            User.findOne({ spotifyId: profile.id})  // find user using googleId
            .then(userFound=>{  // if user search query is successful
                if(userFound){  // if user exists, means its not null
                    // console.log(userFound);
                    return cb(null, userFound);
                }else{  // if user does not exist at all, means if its null, then just create 
                    var userEmail = "spotify@spotify.com";
                    var gotEmail = profile._json.email;
                    if(typeof gotEmail !== "undefined" && gotEmail !== null && gotEmail !== ""){
                        userEmail = gotEmail;
                    }
                    var profilePic = "";
                    if(profile.photos.length > 0){
                        profilePic = profile.photos[0].value;
                    }
                    const newUser = new User({  // new user 
                        spotifyId: profile.id,
                        provider: profile.provider,
                        username: profile.displayName,
                        email: userEmail,
                        emailHash: md5(userEmail),
                        profilePic: profilePic
                    });

                    newUser.save()  // save user credentials into the database
                        .then(ack=>{
                            // console.log(ack);
                            return cb(null, newUser);
                        })
                        .catch(err=>{
                            console.log(err);
                            return cb(err);
                        });
                }
            })
            .catch(err=>{   // if error occurred while finding the user into database
                console.log(err);
                return cb(err);
            }); 
        }
    ));
}

module.exports = { GoogleStrategyConfig, FacebookStrategyConfig, TwitterStrategyConfig, GithubStrategyConfig, SpotifyStrategyConfig };