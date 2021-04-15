// jshint esversion:6
const express = require("express");

const session = require('express-session'); 

// const db = require('./config/mongoose');
const router = express.Router();
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo')(session);


const _ = require("lodash");
const mongoose = require('mongoose');
const DB = require(__dirname+'/db.js');
const utilityFunctions = require(__dirname+'/utilityFunctions.js');
const app = express();
app.set('view engine','ejs');
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// app.use(cookieParser('secret'));

app.use(session({
    secret: 'Utr@1010',
    resave: true,
    saveUninitialized: true
}));


app.locals._=_;
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
DB.connection();
const composeModel = DB.createComposeCollection();
const postModel = DB.createPostsCollection();
const linksModel = DB.createLinksCollection();

module.exports.composeModel=composeModel;
module.exports.postModel=postModel;
module.exports.linksModel=linksModel;

app.get("/",function(req,res){
    res.render("pages/home");
});

app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use('/', require('./routes'));

app.get("/cs-fundamentals/:subject",function(req,res){
    const subject = _.kebabCase(req.params.subject);
    const path='pages/cs-fundamentals/post';
    let title=subject;//keep a default page to display
    if(subject=='object-oriented-programming')
    {
        title='introduction-to-oop';
    }
    else if(subject=='database-management-system')
    {
        title='introduction-to-database';
    }
    utilityFunctions.renderPost(res,path,subject,title);
});

app.get("/cs-fundamentals/:subject/:title",function(req,res){
    const subject = req.params.subject;
    const title = req.params.title;
    const path='pages/cs-fundamentals/post';
    utilityFunctions.renderPost(res,path,subject,title);
});

app.get("/dsa/:subject/:title",function(req,res){
    const subject = req.params.subject;
    let title = _.kebabCase(req.params.title);
    let path="";
    if(subject=='practice')
    {
        title = title+"-practice-problems";
        path='pages/dsa/practiceProblems';
        utilityFunctions.renderPost(res,path,subject,title);
    }
    else{
        path='pages/dsa/post';
        utilityFunctions.renderPost(res,path,subject,title);
    }
});

app.get("/dsa/:subject",function(req,res){
    const subject = _.kebabCase(req.params.subject);
    let path='pages/dsa/post';
    let title="";//default post to display
    if(subject=='practice')
    {
        path='pages/dsa/practiceProblems';
        utilityFunctions.renderPost(res,path,subject,'arrays-practice-problems');
    }
    else{
        if(subject=='algorithms')
        {
            title='introduction-to-algorithms';
        }
        else if(subject=='data-structures')
        {
            title='introduction-to-data-structures';
        }
        utilityFunctions.renderPost(res,path,subject,title);
    } 
});



app.get("/system-design",function(req,res){
    const path='pages/system-design/post';
    res.render(path);
});

app.get("/interview-exp",function(req,res){
    const path='pages/interview-exp/post';
    res.render(path);
});

app.get("/compose",function(req,res){
    const path='pages/compose';
    res.render(path);
});


app.post("/compose",function(req,res){
    req.session.message = {
    type: 'success',
    intro: 'Submitted',
    message: 'your article has been submitted successfully'
    }
    const title=req.body.title;
    const name=req.body.name;
    const email=req.body.email;
    const content=req.body.content;
    if(content.length<60){
        req.session.message = {
        type: 'danger',
        intro: 'Invalid',
        message: 'Article must have atleast 50 characters'
        }
        res.redirect("/compose");
    }
    else{
        const post = new composeModel({
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

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port,function(){
    console.log("server started at port "+ port);
});