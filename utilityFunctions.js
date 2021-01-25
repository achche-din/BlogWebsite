module.exports.getDsaLinks=function(topic){
    var links=null;
    if(topic==='data-structures')
    {
        links={
            Arrays:['what are Arrays?','features of array'],
            LinkedLists:['what are linkedlists?','features of linkedlists'],
            Trees:['what are Trees?','Binary trees','Binary Search trees','Heaps'],
            Graphs:['what are Graphs?','Graph representation','Types of graphs']
        };
    }
    else if(topic==='algorithms')
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

module.exports.getCsfLinks=function(subject){
    var links=null;
    var links=null;
    if(subject==='object-oriented-programming')
    {
        links={
            Encapsulation:['what is encapsulation?','why encapsulation?','When and How to apply?'],
            Inheritance:['what is Inheritance?','why Inheritance?','When and How to apply?'],
            Polymorphism:['what is polymorphism?','why polymorphism?','When and How to apply?'],
            Abstraction:['what is Abstraction?','why Abstraction?','When and How to apply?']
        };
    }
    else if(subject==='database-management')
    {
        links={
            Databases:['What are Databases?','Why databases?','MySQL','Mongodb'],
            SQL:['what is SQL?','Why SQL?','SQL query Structure','SQL Joins','SQL Views','SQL Indexes'],
            Design:['what is Normalisation?','Why Normalisation','1NF','2NF','3NF','BCNF'],
        };
    }
    else if(subject==='computer-networks')
    {
        links={
            ApplicationLayer:['Applications','DNS','DHCP'],
            TransportLayer:['Applications','TCP','UDP'],
            NetworkLayer:['Applications','IP','DV algorithm','OSPF algorithm'],
            DataLinkLayer:['Applications','Flow control','Error Control','MAC'],
            PhysicalLayer:['Applications','Types of Media','Media comparision']
        };
    }
    else if(subject==='operating-system')
    {
        links={
            Intro:['What is OS?','Why OS?'],
            Scheduling:['What is Scheduling?','Premptive VS non-Premptive','FCFS','RR'],
        };
    }
    return links;
};