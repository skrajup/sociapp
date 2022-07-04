require("dotenv").config();
require("./dbConnection/dbConnect")();// establish database connection
const express = require("express");// server software
const ejs = require("ejs");//template engine
const bodyParser = require("body-parser"); // parser middleware
const flash = require("connect-flash"); // for flash messages
const session = require("express-session"); // session middleware
const passport = require("passport");// authentication
const User = require("./models/user"); //import User model
const homeRoutes = require("./routes/homeRoutes"); //import routes
const dashboardRoutes = require("./routes/dashboardRoutes");
const postRoutes = require("./routes/postRoutes");
const userRoutes = require("./routes/userRoutes");

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

// routes
app.use("/", homeRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/posts", postRoutes);
app.use("/users", userRoutes);

// testing


app.listen(3000, ()=>{
    console.log("the app is running on port 3000");
});