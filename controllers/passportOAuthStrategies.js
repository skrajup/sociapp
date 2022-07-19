const passport = require("passport");// authentication
const User = require("../models/user"); //import User model
const md5 = require("md5");
const GoogleStrategy = require("passport-google-oauth20").Strategy;// google strategy
const FacebookStrategy = require("passport-facebook").Strategy; // facebook strategy
const TwitterStrategy = require("passport-twitter").Strategy;   // twitter strategy

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
                    const newUser = new User({  // new user 
                        googleId: profile.id,
                        provider: profile.provider,
                        username: profile.displayName,
                        email: profile.emails[0].value,
                        emailHash: md5(profile.emails[0].value),
                        profilePic: profile.photos[0].value
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
                    const newUser = new User({  // new user 
                        facebookId: profile.id,
                        provider: profile.provider,
                        username: profile.displayName,
                        email: "facebook@fb.com",
                        emailHash: md5("facebook@fb.com"),
                        profilePic: profile.photos[0].value
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
                    const newUser = new User({  // new user 
                        twitterId: profile.id,
                        provider: profile.provider,
                        username: profile.displayName,
                        email: "twitter@tweet.com",
                        emailHash: md5("twitter@tweet.com"),
                        profilePic: profile.photos[0].value
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

module.exports = { GoogleStrategyConfig, FacebookStrategyConfig, TwitterStrategyConfig };