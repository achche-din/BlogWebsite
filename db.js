const mongoose = require('mongoose');
module.exports.connection=function(){
    //connect with database
    mongoose.connect('mongodb+srv://pkc3766:Utr@1010@cluster0.7n9fq.mongodb.net/blogDB?retryWrites=true&w=majority',{
        useNewUrlParser:true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    });
    mongoose.connection.once('open',function(){
        console.log('Database connection has been made');
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
    return mongoose.model("post",postsCollection,'posts');
};

module.exports.createUserCollection=function(){
    //connection();
    const userCollection= mongoose.Schema({
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        mobile_number:{
            type:Number,
            required :true
        }
    });
    return mongoose.model("User", userCollection);
};