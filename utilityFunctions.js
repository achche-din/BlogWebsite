// const mongoose = require('mongoose');
// const path = require('path')
const app = require('./app');

module.exports.renderPost=function(response,path,subject,title){
    let content='Content not available as of now? We are writing. Thankyou! for your patience';
    let links={};
    const linksModel = app.linksModel;
    linksModel.find({subject:subject},function(err,res){
        if(err)
        {
            console.log(err);
            response.json(err);
        }
        else{
            const postModel = app.postModel;
            if(res.length!=0)
                links=res[0].links;
            postModel.find({title:title},function(err,res){
                if(err){
                    console.log(err);
                    response.json(err);
                }
                else{
                    if(res.length!=0)
                        content = res[0].content;
                    if(subject!="practice")
                        response.render(path,{subject:subject,title:title,links:links,content:content});
                    else{
                        response.render(path,{links:links,content:content});
                    }
                }
            })
        }
    });
    
};

