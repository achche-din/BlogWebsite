const mongoose = require('mongoose');


module.exports.getLinks=function(subject){
    var links=null;
    var links=null;
    if(subject==='object-oriented-programming')
    {
        links={
            Encapsulation:['understand Encapsulation'],
            Inheritance:['understand Inheritance','Types of Inheritance','Challenge Questions'],
            Polymorphism:['understand Polymorphism?'],
            Abstraction:['understand Abstraction?']
        };
    }
    else if(subject==='database-management-system')
    {
        links={
            Databases:['keys in DBMS','Relationships in Databases','ACID properties'],
            SQL:['Introduction to SQL','Foreign key constraints','SQL Joins','SQL Views','SQL Indexes'],
            Design:['Introduction to Normalisation','Normal Forms'],
        };
    }
    else if(subject==='computer-networks')
    {
        links={
            ApplicationLayer:['Introduction to Application layer','DNS','DHCP'],
            TransportLayer:['Introduction to Transport layer','TCP','UDP'],
            NetworkLayer:['Introduction to Network layer','IP','DV algorithm','OSPF algorithm'],
            DataLinkLayer:['Introduction to Data link layer','Flow control','Error Control','MAC'],
            PhysicalLayer:['Introduction to Physical layer','Types of Media','Media comparision']
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
            Arrays:['Introduction to Arrays'],
            Stack:['Introduction to Stack'],
            LinkedLists:['Introduction to Linked Lists'],
            HashTables:['Introduction to Hash tables','Open Addressing','Separate Chaining'],
            Trees:['Introduction to Trees','Binary Tree Traversal','Binary Search trees','Heaps'],
            Graphs:['Introduction to Graphs']
        };
    }
    else if(subject==='algorithms')
    {
        links={
            ComplexityAnalysis:['Introduction to complexity analysis'],
            Searching:['Binary Search'],
            Sorting:['Bubble sort','Insertion sort','Counting Sort','Merge sort',
                        'Quick sort'],
            Greedy:['Introduction to Greedy','Job scheduling','Meeting Rooms'],
            Recursion:['Introduction to Recursion','Tower of Hanoi','Coin Change Recursive'],
            BackTracking:['Introduction to Backtracking','Maze problem','N-Queen problem'],
            DynamicProgramming:['Introduction to Dynamic programming','Rod Cutting','0/1 Knapsack Problem']
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