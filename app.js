const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");

const app = express();
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get("/",(req, res)=>{
    res.render("homepage");
});

app.listen(3000, ()=>{
    console.log("the app is running on port 3000");
});