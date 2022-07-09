require("dotenv").config();
require("./dbConnection/dbConnect")();// establish database connection
const express = require("express");// server software
const ejs = require("ejs");//template engine
const bodyParser = require("body-parser"); // parser middleware
const md5 = require("md5");
const flash = require("connect-flash"); // for flash messages
const session = require("express-session"); // session middleware
const passport = require("passport");// authentication
const GoogleStrategy = require("passport-google-oauth20").Strategy;// google strategy
const findOrCreate = require("mongoose-findorcreate");// findOrCreate function
const User = require("./models/user"); //import User model

// import routes
const homeRoutes = require("./routes/homeRoutes"); //import routes
const authenticationRoutes = require("./routes/authenticationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();
const http = require("http").createServer(app);//create http server for scoket.io

const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
// To create a virtual path prefix (where the path does not actually exist in the file system) for files that are served by the express.static function, specify a mount path for the static directory, as shown below:
app.use('/dashboard', express.static('public'));
app.use('/dashboard/profile', express.static('public'));
app.use('/posts', express.static('public'));
app.use('/posts/:id', express.static('public'));
app.use('/users', express.static('public'));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(flash());// for flash messages

// Configure Sessions Middleware
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

// Configure More Middleware
app.use(passport.initialize());
app.use(passport.session());

//passport local strategy
passport.use(User.createStrategy());

//so we have update serialization and deserialization which will work for any type of Strategy from passport documentation
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// passport strategy to login using user's google account by using OAuth 2.0 API
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/dashboard",
    scope: ['profile', 'email', 'openid']
},  
// function verify(accessToken, refreshToken, profile, cb){
//     // console.log(profile);
//     console.log(profile);
//         User.findOrCreate({ googleId: profile.id}, function (err, user) {  
//             // console.log(user);
//             user.username = profile._json.name;
//             user.email = profile._json.email;
//             user.profilePic = profile._json.picture;
//             console.log(user);
//             console.log(cb);
//             return cb(err, user);
//         });

        
//     }

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
                            console.log(ack);
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


        // db.get('SELECT * FROM federated_credentials WHERE provider = ? AND subject = ?', [
        // 'https://accounts.google.com',
        // profile.id
        // ], function(err, cred) {
        // if (err) { return cb(err); }
        
        // if (!cred) {
        //     // The account at Google has not logged in to this app before.  Create a
        //     // new user record and associate it with the Google account.
        //     db.run('INSERT INTO users (name) VALUES (?)', [
        //     profile.displayName
        //     ], function(err) {
        //     if (err) { return cb(err); }

        //     var id = this.lastID;
        //     db.run('INSERT INTO federated_credentials (user_id, provider, subject) VALUES (?, ?, ?)', [
        //         id,
        //         'https://accounts.google.com',
        //         profile.id
        //     ], function(err) {
        //         if (err) { return cb(err); }
        //         var user = {
        //         id: id,
        //         name: profile.displayName
        //         };
        //         return cb(null, user);
        //     });
        //     });
        // } else {
        //     // The account at Google has previously logged in to the app.  Get the
        //     // user record associated with the Google account and log the user in.
        //     db.get('SELECT * FROM users WHERE id = ?', [ cred.user_id ], function(err, row) {
        //     if (err) { return cb(err); }
        //     if (!row) { return cb(null, false); }
        //     return cb(null, row);
        //     });
        // }
        // });
    }
));

// routes
app.use("/", homeRoutes);
app.use("/auth", authenticationRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/posts", postRoutes);
app.use("/users", userRoutes);

// testing


// app.listen(3000, ()=>{
//     console.log("the app is running on port 3000");
// });

http.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
});



// socket implementation
const io = require("socket.io")(http);

io.on("connection", (socket)=>{
    console.log("Connected.......");

    socket.on("newMessage", (msg)=>{
        socket.broadcast.emit("newMessageReceiving", msg);
    });
});

