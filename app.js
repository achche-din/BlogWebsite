// jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("lodash");
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
    res.render("pages/home");
});

app.get("/cs-fundamentals/:subject",function(req,res){
    const subject = _.kebabCase(req.params.subject);
    console.log(subject);
    const path='pages/cs-fundamentals/post';
    //res.send();
    res.render(path,{subject:subject});
});

app.get("/dsa/:topic",function(req,res){
    const topic = _.kebabCase(req.params.topic);
    console.log(topic);
    const path='pages/dsa/post';
    //res.send();
    res.render(path,{topic:topic});
});

app.get("/system-design",function(req,res){
    const path='pages/system-design/post';
    res.render(path);
});

app.get("/interview-exp",function(req,res){
    const path='pages/interview-exp/post';
    //res.send();
    res.render(path);
});

app.get("/compose",function(req,res){
    const path='pages/compose';
    //res.send();
    res.render(path);
});

app.get("/contact",function(req,res){
    const path='pages/contact';
    //res.send();
    res.render(path);
});

//handles non routable paths
app.get('*', function(req, res) {  
    res.render('pages/error');
});



app.listen(3000,function(){
    console.log("server started at port 3000");
});