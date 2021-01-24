const mongoose = require('mongoose');
module.exports.connection=function(){
    //connect with database
    mongoose.connect('mongodb://localhost/composedb',{useNewUrlParser:true},{ useUnifiedTopology: true });
    mongoose.connection.once('open',function(){
        console.log('connection has been made');
    }).on('error',function(error){
        console.log('error is'+error);
    });
};

module.exports.createSchema=function(){
    //connection();
    const composedb= mongoose.Schema({
        title:String,
        name:String,
        email:String,
        content:String
    });
    return mongoose.model("Post",composedb);
};



