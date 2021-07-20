const express = require('express');

var blogContentRouter = express.Router()
const path = require('path')
const app = require('../app')
const _ = require("lodash");

const utilityFunctions = require(path.join(__dirname,'..','utilityFunctions.js'));

const composeModel = app.composeModel

blogContentRouter.get("/cs-fundamentals/:subject",function(req,res){
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
    else if(subject=='operating-system')title='introduction-to-operating-systems';
    utilityFunctions.renderPost(res,path,subject,title);
});

blogContentRouter.get("/cs-fundamentals/:subject/:title",function(req,res){
    const subject = req.params.subject;
    const title = req.params.title;
    const path='pages/cs-fundamentals/post';
    utilityFunctions.renderPost(res,path,subject,title);
});

blogContentRouter.get("/dsa/:subject/:title",function(req,res){
    const subject = req.params.subject;
    let title = _.kebabCase(req.params.title);
    let path='pages/dsa/post';
    utilityFunctions.renderPost(res,path,subject,title);
});

blogContentRouter.get("/dsa/:subject",function(req,res){
    const subject = _.kebabCase(req.params.subject);
    let path='pages/dsa/post';
    let title="";//default post to display
    if(subject=='practice')
    {
        // path='pages/dsa/practiceProblems';
        title = 'arrays-practice-problems';
        // utilityFunctions.renderPost(res,path,subject,);
    }
    // else{
        else if(subject=='algorithms')
        {
            title='introduction-to-algorithms';
        }
        else if(subject=='data-structures')
        {
            title='introduction-to-data-structures';
        }
        utilityFunctions.renderPost(res,path,subject,title);
    // } 
});



blogContentRouter.get("/system-design",function(req,res){
    const path='pages/system-design/post';
    res.render(path);
});

blogContentRouter.get("/interview-exp",function(req,res){
    const path='pages/interview-exp/post';
    res.render(path);
});

blogContentRouter.get("/compose",function(req,res){
    const path='pages/compose';
    res.render(path);
});


blogContentRouter.post("/compose",function(req,res){
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

module.exports = blogContentRouter;