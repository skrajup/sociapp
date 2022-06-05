const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

mongoose.connect("mongodb://localhost:27017/sociappDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res)=>{
    res.render("homepage");
});

app.get("/create-post", (req, res)=>{
    res.render("create-post");
})

app.get("/profile", (req, res)=>{
    res.render("profile");
})


app.post("/signup", (req, res)=>{
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    });

    newUser.save((err) => {
        if(err){
            console.log(err);
        }else{
            res.render("home-dashboard");
        }
    });
});

app.post("/signin", (req, res)=>{
    const username = req.body.username;
    const password = req.body.password;
    
    User.findOne({username: username}, (err, foundUser)=>{
        if(err){
            console.log(err);
        }else{
            if(foundUser){
                // console.log(foundUser);
                if(foundUser.password === password){
                    res.render("home-dashboard");
                }
            }
        }
    });
});

app.listen(3000, ()=>{
    console.log("the app is running on port 3000");
});