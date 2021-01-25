// jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const session = require('express-session'); 

const _ = require("lodash");
const mongoose = require('mongoose');
const { body,validationResult } = require('express-validator');
// const utilityFunctions = require(__dirname+"/scripts/utilityFunctions.js");
//const homePageScript = require(__dirname+"/scripts/homePageScript");
const composedb = require(__dirname+'/composedb.js');
const app = express();
app.set('view engine','ejs');
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser('secret'))
app.use(session({cookie: {maxAge: null}}))

//flash message middleware
app.use((req, res, next)=>{
    res.locals.message = req.session.message
    delete req.session.message
    next()
  })

// app.use(expressValidator());
app.use(express.static("public"));

//console.log(utilityFunctions);
//can call utiltiy functions using utilityFunctions.getDate() etc
composedb.connection();
const Post = composedb.createSchema();

app.get("/",function(req,res){
    res.render("pages/home");
});

app.get("/cs-fundamentals/:subject",function(req,res){
    const subject = _.kebabCase(req.params.subject);
    console.log(subject);
    const path='pages/cs-fundamentals/post';
    //res.send();
    var links=null;
    if(subject==='object-oriented-programming')
    {
        links={
            Encapsulation:['what is encapsulation?','why encapsulation?','When and How to apply?'],
            Inheritance:['what is Inheritance?','why Inheritance?','When and How to apply?'],
            Polymorphism:['what is polymorphism?','why polymorphism?','When and How to apply?'],
            Abstraction:['what is Abstraction?','why Abstraction?','When and How to apply?']
        };
    }
    else if(subject==='database-management')
    {
        links={
            Databases:['What are Databases?','Why databases?','MySQL','Mongodb'],
            SQL:['what is SQL?','Why SQL?','SQL query Structure','SQL Joins','SQL Views','SQL Indexes'],
            Design:['what is Normalisation?','Why Normalisation','1NF','2NF','3NF','BCNF'],
        };
    }
    else if(subject==='computer-networks')
    {
        links={
            ApplicationLayer:['Applications','DNS','DHCP'],
            TransportLayer:['Applications','TCP','UDP'],
            NetworkLayer:['Applications','IP','DV algorithm','OSPF algorithm'],
            DataLinkLayer:['Applications','Flow control','Error Control','MAC'],
            PhysicalLayer:['Applications','Types of Media','Media comparision']
        };
    }
    else if(subject==='operating-system')
    {
        links={
            Intro:['What is OS?','Why OS?'],
            Scheduling:['What is Scheduling?','Premptive VS non-Premptive','FCFS','RR'],
        };
    }
    // links=JSON.stringify(links);
    res.render(path,{subject:subject,links:links});
});

app.get("/dsa/:topic",function(req,res){
    const topic = _.kebabCase(req.params.topic);
    console.log(topic);
    const path='pages/dsa/post';
    var links=null;
    if(topic==='data-structures')
    {
        links={
            Arrays:['what are Arrays?','features of array'],
            LinkedLists:['what are linkedlists?','features of linkedlists'],
            Trees:['what are Trees?','Binary trees','Binary Search trees','Heaps'],
            Graphs:['what are Graphs?','Graph representation','Types of graphs']
        };
    }
    else if(topic==='algorithms')
    {
        links={
            Searching:['Linear search','Binary Search','Ternary Search'],
            Sorting:['Bubble sort','Insertion sort','Selection sort','Merge sort',
                        'Quick sort','Counting sort'],
            Recursion:['What is Recursion?','Visualisation of Recursion','Coin Change Problem'],
            Greedy:['What are Greedy algorithms?','Job scheduling algoritm','Dijkistra algoritm'],
            DynamicProgramming:['what is Dynamic programming','Kadane algorithm','Coin change Problem']
        };
    }
    
    //res.send();
    res.render(path,{topic:topic,links:links});
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

app.post("/compose",[body('name', 'Invalid name').trim().isLength({ min: 1 }),
    body('title', 'Invalid title').trim().isLength({ min: 1 }),
    body('email', 'Invalid email').trim().isEmail(),
    body('content', 'Article must have characters > 50').trim().isLength({ min: 50 })],
    function(req,res){
    //need to validate form also
    let errors = validationResult(req);
    // console.log(typeof errors);
    // console.log(errors);
    // console.log("array");
    // console.log(errors.array().length);
    // console.log(errors.array()[0].msg);
    // console.log(errors.array());
    // console.log("mapped");
    // console.log(errors.mapped());
    //res.send("");
    let errorArray=errors.array();
    if(errorArray.length>0)
    {
        // let d='';
        // errorArray.forEach(function(error){
        //     d = d+error.msg+"<br>";
        // });
        req.session.message = {
            type: 'danger',
            intro: 'Empty fields! ',
            message: 'Please insert valid information.'
          }
        res.redirect('compose');
        // console.log(errorArray.length);
        // console.log(errorArray[0].msg);
        // res.render('pages/compose',{errors: errorArray});
        // return res.status(422).json({ errors: errors.array() });
    }
    else{
        req.session.message = {
            type: 'success',
            intro: 'Submitted',
            message: 'your article has been submitted successfully'
          }
            const title=req.body.title;
            const name=req.body.name;
            const email=req.body.email;
            const content=req.body.content;
            const post = new Post({
                title: title,
                name:name,
                email: email,
                content: content
            });
            post.save(function(err){
                if (!err){
                    //make a toast that your post has been sent. Our team will look into it.
                    res.redirect("compose");
                }
                else{
                    res.send("error occured please try again");
                }
            });
        }
    
});

//handles non routable paths
app.get('*', function(req, res) {  
    res.render('pages/error');
});



app.listen(3000,function(){
    console.log("server started at port 3000");
});