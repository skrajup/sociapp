const mongodb = require("mongodb");
const mongoose = require("mongoose");

//connect to database
module.exports = function () {  
    mongoose.connect("mongodb://localhost:27017/sociappDB", {useNewUrlParser: true});
    console.log("database connection established");
}
