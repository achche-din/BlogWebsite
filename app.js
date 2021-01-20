// jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
// const utilityFunctions = require(__dirname+"/scripts/utilityFunctions.js");
//const homePageScript = require(__dirname+"/scripts/homePageScript");
const app = express();
app.set('view engine','ejs');
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//console.log(utilityFunctions);
//can call utiltiy functions using utilityFunctions.getDate() etc

app.get("/",function(req,res){
    
    res.render("html/home.html");
});

// app.get("/")

app.listen(3000,function(){
    console.log("server started at port 3000");
});