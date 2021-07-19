const express = require('express');
const _ = require('lodash')
var blogCRUDRouter = express.Router()
const app = require('../app');

/** 
 * Subjects: OOP's, DBMS, Operation Systems, Computer Networks, Datastructures, Algorithms etc
 * links of a subject will contain all the topics along with their subtopics
 * returns all the links of a subject 
 * */
blogCRUDRouter.get("/find/:subject",(request,response)=>{
    const linksModel = app.linksModel
    linksModel.findOne({subject:request.params['subject']},(err,res)=>{
        if(err)
        {
            console.log(err);
        }
        else{
            let prep=res.prep;
            let subject = res.subject;
            let links = res.links;
            response.render("pages/ContentCRUD/FindOne",
                {'prep':prep,'subject':subject,
                        'links':links})
        }
    });
})
/**
 * Subjects: OOP's, DBMS, Operation Systems, Computer Networks, Datastructures, Algorithms etc
 * returns all the subjects
 *  */
blogCRUDRouter.get("/find",function(request,response){
    const linksModel = app.linksModel
    linksModel.find({},(err,res)=>{
        if(err)
        {
            console.log(err);
        }
        else{
            let subjects=[];
            for(var i=0;i<res.length;i++)
            {
                subjects.push(res[i].subject);
            }
            response.render("pages/ContentCRUD/FindAll",{'subjects':subjects})
        }
    })
    ;
})

/**
 * saves a Post with title postTitle in subject subject
 */
blogCRUDRouter.post("/:subject/:postTitle/save",(request,response)=>{
    const postModel = app.postModel
    let postTitle = request.params['postTitle']
    let content = request.body['content']
    postModel.updateOne({title:postTitle},
        {content:content},
        (err,res)=>{
            if(err)
            {
                console.log(err)
                response.send(err)
            }
            else
            {
                let redirectURL = "/blog/find/"+request.params['subject']
                response.redirect(redirectURL)
            }
           
        }
    )

})

/**
 * edit a post with title postTitle
 */
blogCRUDRouter.get("/:subject/:postTitle/edit",(request,response)=>{
    let subject = request.params['subject']
    let postTitle = request.params['postTitle']
    // console.log(subject,postTitle)
    const postModel = app.postModel
    postModel.findOne({title:postTitle},(err,res)=>{
        if(err)
        {
            response.send(err)
        }
        else{    
            response.render('pages/ContentCRUD/EditBlog',{
                subject:subject,res:res
            });
        }
    }) 
})

/**
 * deletes a post with title postTitle
 * delete post from both links and posts collections
 */
blogCRUDRouter.get("/:subject/:topic/:postTitle/delete",(request,response)=>{
    let subject = request.params['subject']
    let topic = request.params['topic']
    let postTitle = request.params['postTitle']
    const postModel = app.postModel
    const linkModel = app.linksModel
    linkModel.findOne({subject:subject},(err,res)=>{
        if(err)
        {
            response.send(err);
        }
        else{
            let links = res.links;
            let arr = links[topic]
            let ind = arr.indexOf(postTitle);
            if(ind>-1)
            {
                arr.splice(ind,1);
                linkModel.updateOne({subject:subject},{links:links},(err)=>{
                    if(!err){
                        postModel.deleteOne({title:postTitle},(err)=>{
                            if(err)
                            {
                                response.send(err)
                            }
                            else{    
                                let redirectionURL = "/blog/find/"+subject;
                                response.redirect(redirectionURL)
                            }
                        })
                    }
                })
            }
            else{
                let redirectionURL = "/blog/find/"+subject;
                response.redirect(redirectionURL)
            } 
        }
    })
    
})

/**
 * adds a topic to a subject
 */
blogCRUDRouter.post("/:subject/add-topic",(request,response)=>{
    let subject = request.params['subject'];
    let topicToBeAdded = request.body['topic'];
    //find by subject and add to link attribute in linkModel
    let linkModel = app.linksModel;
    linkModel.findOne({subject:subject},(err,res)=>{
        if(err)
        {
            respose.send(err);
        }
        else
        {
            let links = res.links;
            links[topicToBeAdded]=[];
            linkModel.updateOne({subject:subject},{links:links},(err,result)=>{
                if(err)
                {
                    respose.send(err);
                }
                else
                {
                    let redirectionURL = "/blog/find/"+subject;
                    response.redirect(redirectionURL)
                }
            })
        }
    });
    
})

/**
 * adds a subtopic to a topic of a subject
 */
blogCRUDRouter.post("/:subject/:topic/add-subtopic",(request,response)=>{
    let subject = request.params['subject'];
    let topic = request.params['topic'];
    let subTopicToBeAdded = request.body['subtopic']
    let linkModel = app.linksModel;
    linkModel.findOne({subject:subject},(err,res)=>{
        if(err)
        {
            respose.send(err);
        }
        else
        {
            let links = res.links;
            links[topic].push(subTopicToBeAdded);
            linkModel.updateOne({subject:subject},{links:links},(err,result)=>{
                if(err)
                {
                    respose.send(err);
                }
                else
                {
                    let post = new app.postModel({
                        title:_.kebabCase(subTopicToBeAdded),
                        content:""
                    })
                    post.save((err,res)=>{
                        if(err)
                        {
                            res.send(err);
                        }
                        else
                        {
                            let redirectionURL = "/blog/find/"+subject;
                            response.redirect(redirectionURL)
                        }
                    })
                }
            })
        }
    });
})

module.exports = blogCRUDRouter;