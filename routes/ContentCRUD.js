const express = require('express');
// const path = require('path')
var blogCRUDRouter = express.Router()
const app = require('../app')
// const DB = require(path.join(__dirname,'..','DB/schema.js'));

blogCRUDRouter.get("/find/:subject",(request,response)=>{
    const linksModel = app.linksModel
    // console.log(request.params['subject'])
    linksModel.findOne({subject:request.params['subject']},(err,res)=>{
        if(err)
        {
            console.log(err);
        }
        else{
            let prep=res.prep;
            let subject = res.subject;
            let links = res.links;
            // console.log(prep,subject);
            response.render("pages/ContentCRUD/FindOne",
                {'documentTitle':'admin','prep':prep,'subject':subject,
                        'links':links})
        }
    });
})

blogCRUDRouter.get("/find",function(request,response){
    const linksModel = app.linksModel
    linksModel.find({},(err,res)=>{
        if(err)
        {
            console.log(err);
        }
        else{
            let subjects=[];
            let topics=[]
            let prep=[]
            for(var i=0;i<res.length;i++)
            {
                prep.push(res[i].prep)
                subjects.push(res[i].subject);
                topics.push(res[i].links);
            }
            response.render("pages/ContentCRUD/FindAll",{'prep':prep,'subjects':subjects,
                    'links':topics})
        }
    })
    ;
})

blogCRUDRouter.patch("/:postTitle/save",(request,response)=>{

})

blogCRUDRouter.get("/:subject/:postTitle/edit",function(request,response){
    let subject = request.params['subject']
    let postTitle = request.params['postTitle']
    // console.log(subject,postTitle)
    const postModel = app.postModel
    postModel.findOne({title:postTitle},(err,res)=>{
        if(err)
        {
            console.log(err)
        }
        else{
            // console.log(res)
            let documentTitle = 'edit-'+res.title
            response.render('pages/ContentCRUD/EditBlog',{
                documentTitle:documentTitle,
                res:res
            })
        }
    }) 
})

module.exports = blogCRUDRouter;