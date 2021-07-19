// jshint esversion:6
const express = require("express");
// const path = require('path')
const session = require('express-session'); 

const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const MongoStore = require('connect-mongo')(session);
const DB = require(__dirname+'/DB/schema.js');

const _ = require("lodash");

const app = express();
app.set('view engine','ejs');
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


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

app.use(express.static("public"));



app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);
app.use('/', require('./routes'));

//BlogCRUD router
//app.use('/blog',require('./routes/ContentCRUD'))

//BlogContent router
app.use(require('./routes/BlogContent'))

//connect to DB
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

module.exports = app