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
const blogDb = require(__dirname+'/db.js');
const utilityFunctions = require(__dirname+'/utilityFunctions.js');
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
blogDb.connection();
const Compose = blogDb.createComposeCollection();
const Post = blogDb.createPostsCollection();

app.get("/",function(req,res){
    res.render("pages/home");
});

app.get("/cs-fundamentals/:subject",function(req,res){
    const subject = _.kebabCase(req.params.subject);
    const path='pages/cs-fundamentals/post';
    //res.send();
    let links=utilityFunctions.getCsfLinks(subject);
    // links=JSON.stringify(links);
    let content ='hey there';
    res.render(path,{subject:subject,links:links,content:content});
});

app.get("/cs-fundamentals/:subject/:post",function(req,res){
    const subject = _.kebabCase(req.params.subject);
    const post = _.kebabCase(req.params.post);
    console.log('in csf');
    console.log(post);
    const path='pages/cs-fundamentals/post';
    let links = utilityFunctions.getCsfLinks(subject);
    let content='I am good here.How are you?';
    res.render(path,{subject:subject,links:links,content:content});
});

app.get("/dsa/:topic/:post",function(req,res){
    const topic = _.kebabCase(req.params.topic);
    const post = _.kebabCase(req.params.post);
    console.log('in dsa');
    console.log(post);
    const path='pages/dsa/post';
    let links = utilityFunctions.getDsaLinks(topic);
    let content='hope you are fine?';
    res.render(path,{topic:topic,links:links,content:content});
});

app.get("/dsa/:topic",function(req,res){
    const topic = _.kebabCase(req.params.topic);
    //console.log(topic);
    const path='pages/dsa/post';
    let content ='how are you?';
    let links = utilityFunctions.getDsaLinks(topic);
    res.render(path,{topic:topic,links:links,content:content});
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
            const post = new Compose({
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