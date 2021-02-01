const mongoose = require('mongoose');


module.exports.getLinks=function(subject){
    var links=null;
    var links=null;
    if(subject==='object-oriented-programming')
    {
        links={
            OOP:['Introduction to OOP?'],
            Encapsulation:['understand Encapsulation'],
            Inheritance:['understand Inheritance','Types of Inheritance','Challenge Questions'],
            Polymorphism:['understand Polymorphism?'],
            Abstraction:['understand Abstraction?']
        };
    }
    else if(subject==='database-management-system')
    {
        links={
            Databases:['Introduction to database','ACID properties','RDBMS'],
            SQL:['what is SQL?','Why SQL?','SQL query Structure','SQL Joins','SQL Views','SQL Indexes'],
            Design:['what is Normalisation?','Why Normalisation','1NF','2NF','3NF','BCNF'],
        };
    }
    else if(subject==='computer-networks')
    {
        links={
            ApplicationLayer:['Role of Application layer','DNS','DHCP'],
            TransportLayer:['Role of Transport layer','TCP','UDP'],
            NetworkLayer:['Role of Network layer','IP','DV algorithm','OSPF algorithm'],
            DataLinkLayer:['Role of Data link layer','Flow control','Error Control','MAC'],
            PhysicalLayer:['Role of Physical layer','Types of Media','Media comparision']
        };
    }
    else if(subject==='operating-system')
    {
        links={
            Intro:['What is OS?','Why OS?'],
            Scheduling:['What is Scheduling?','Premptive VS non-Premptive','FCFS','RR'],
        };
    }
    else if(subject==='data-structures')
    {
        links={
            Arrays:['what are Arrays?','features of array'],
            Stack:['All about Stack'],
            LinkedLists:['what are linkedlists?','features of linkedlists'],
            Trees:['what are Trees?','Binary trees','Binary Search trees','Heaps'],
            Graphs:['what are Graphs?','Graph representation','Types of graphs']
        };
    }
    else if(subject==='algorithms')
    {
        links={
            Searching:['Linear search','Binary Search','Ternary Search'],
            Sorting:['Bubble sort','Insertion sort','Selection sort','Merge sort',
                        'Quick sort','Counting sort'],
            Recursion:['What is Recursion?','Visualisation of Recursion','Coin Change Problem'],
            Greedy:['What are Greedy algorithms?','Job scheduling algoritm','Dijkistra algoritm'],
            DynamicProgramming:['what is Dynamic programming','Kadane algorithm','Coin change Problem']
        };
    }
    return links;
};

module.exports.renderPost=function(res,path,subject,title){
    let content='Content not available as of now? We are writing. Thankyou! for your patience';
    let links=this.getLinks(subject);
    var action = function (err, collection) {
        collection.find({title:title}).toArray(function(err, results) {
            if(results.length!=0)
            {
                content=results[0].content;
            }   
            res.render(path,{subject:subject,title:title,links:links,content:content});
        });
        
    };
    mongoose.connection.db.collection('posts',action);
};