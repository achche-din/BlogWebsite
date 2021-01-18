// jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const utilityFunctions = require(__dirname+"/utilityFunctions.js");
const app = express();
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//console.log(utilityFunctions);
//can call utiltiy functions using utilityFunctions.getDate() etc

app.get("/",function(req,res){
    res.render("home");
});

app.listen(3000,function(){
    console.log("server started at port 3000");
});