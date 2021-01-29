// jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const session = require('express-session'); 

// const db = require('./config/mongoose');
const router = express.Router();
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo')(session);


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

// app.use(session({
//     name: 'CodeBay',
//     // TODO change the secret before deployment in production mode
//     secret: 'blahsomething',
//     saveUninitialized: false,
//     resave: false,
//     cookie: {
//         maxAge: (1000 * 60 * 100)
//     },
//     store: new MongoStore(
//         {
//             mongooseConnection: db,
//             autoRemove: 'disabled'
        
//         },
//         function(err){
//             console.log(err ||  'connect-mongodb setup ok');
//         }
//     )
// }));



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
blogDb.connection();
const Compose = blogDb.createComposeCollection();
// const Post = blogDb.createPostsCollection();

app.get("/",function(req,res){
    console.log("Requesting home page")
    res.render("pages/home");
});


app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use('/', require('./routes'));

app.get("/cs-fundamentals/:subject",function(req,res){
    const subject = _.kebabCase(req.params.subject);
    const path='pages/cs-fundamentals/post';
    //res.send();
    let links=utilityFunctions.getCsfLinks(subject);
    // links=JSON.stringify(links);
    let content ='hey there';
    res.render(path,{subject:subject,title:subject,links:links,content:content});
});

app.get("/cs-fundamentals/:subject/:title",function(req,res){
    const subject = req.params.subject;
    const title = req.params.title;
    console.log('in csf');
    console.log(title);
    const path='pages/cs-fundamentals/post';
    let links = utilityFunctions.getCsfLinks(subject);
    let content='I am good here.How are you?';
    res.render(path,{subject:subject,title:title,links:links,content:content});
});

app.get("/dsa/:subject/:title",function(req,res){
    const subject = req.params.subject;
    const title = req.params.title;
    console.log('in dsa');
    console.log(subject);
    const path='pages/dsa/post';
    let links = utilityFunctions.getDsaLinks(subject);
    let content='hope you are fine?';
    var action = function (err, collection) {
        collection.find({title:title}).toArray(function(err, results) {
            if(results.length==0)
            {
                res.render(path,{subject:subject,title:title,links:links,content:content});
            }
            else{
                content=results[0].content;
                res.render(path,{subject:subject,title:title,links:links,content:content});
            }
        });
        
    };
    mongoose.connection.db.collection('posts',action);
});

app.get("/dsa/:subject",function(req,res){
    const subject = _.kebabCase(req.params.subject);
    //console.log(subject);
    const path='pages/dsa/post';
    let content ='how are you?';
    
    let links = utilityFunctions.getDsaLinks(subject);
    res.render(path,{subject:subject,title:subject,links:links,content:content});
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
            intro: 'Invalid details! ',
            message: 'title,name,email must not be empty and content must have > 50 characters'
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