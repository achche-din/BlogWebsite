const mongoose = require('mongoose');
module.exports.connection=function(){
    //connect with database
    mongoose.connect('mongodb://localhost/blogDb',{useNewUrlParser:true},{ useUnifiedTopology: true });
    mongoose.connection.once('open',function(){
        console.log('connection has been made');
    }).on('error',function(error){
        console.log('error is'+error);
    });
};

module.exports.createComposeCollection=function(){
    //connection();
    const composeCollection= mongoose.Schema({
        title:String,
        name:String,
        email:String,
        content:String
    });
    return mongoose.model("compose",composeCollection);
};

module.exports.createPostsCollection=function(){
    //connection();
    const postsCollection= mongoose.Schema({
        title:String,
        content:String
    });
    return mongoose.model("post",postsCollection);
};



