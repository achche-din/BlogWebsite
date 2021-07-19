const app = require('./app');

/**
 * 
 * @param {object} response 
 * @param {path where post is rendered} path 
 * @param {subject whose post is to be rendered} subject 
 * @param {title of the post to be rendered} title 
 * renders post with title :title of subject :subject on url :path
 */
module.exports.renderPost=function(response,path,subject,title){
    let content='Content not available as of now? We are writing. Thankyou! for your patience';
    let links={};
    const linksModel = app.linksModel;
    linksModel.find({subject:subject},function(err,res){
        if(err)
        {
            response.json(err);
        }
        else{
            const postModel = app.postModel;
            if(res.length!=0)
                links=res[0].links;
            postModel.findOne({title:title},function(err,res){
                if(err){
                    console.log(err);
                    response.json(err);
                }
                else{
                    if(res==null)
                    {
                        response.send("error occured please try again!!");
                        return;
                    }
                    if(res.content!="")
                    {
                        content=res.content;
                    }
                    // if(subject!="practice")
                        response.render(path,{subject:subject,title:title,links:links,content:content});
                    // else
                    // {
                        // console.log(links);
                        // response.render(path,{links:links,content:content});
                    // }
                }
            })
        }
    });
    
};

