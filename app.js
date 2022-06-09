require("dotenv").config();
require("./dbConnection/dbConnect")();// establish database connection
const express = require("express");// server software
const ejs = require("ejs");//template engine
const bodyParser = require("body-parser"); // parser middleware
const session = require("express-session"); // session middleware
const passport = require("passport");// authentication
const User = require("./models/user"); //import User model
const routes = require("./routes/route"); //import routes

const app = express();
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

// routes
app.use("/", routes);

app.listen(3000, ()=>{
    console.log("the app is running on port 3000");
});