// single key index
db.users.find({"username" : "username4335"}).explain();
db.users.ensureIndex({"username" : 1});
db.users.find({"username" : {$gt: "username4550"}}).explain();
db.users.find({"username" : {$regex: /^us/ }}).explain();
db.users.find({"username" : {$gt: "username4550", $lt : "username7779"}}).explain();
//------------------------------------------------------------------------------------


// multikey index
db.users.find({"interests" : "music"}).explain();
db.users.ensureIndex({"interests" : 1});
db.users.find({"interests" : "music"}).explain();
db.users.find({"interests" : {$all: ["gaming", "music"]}}).explain();
db.users.find({"interests" : {$in: ["gaming", "music"]}}).explain();
//------------------------------------------------------------------------------------


// compound index
db.users.find({profession : "Biker", age : 35}).explain();

db.users.ensureIndex({"profession" : 1});
db.users.find({profession : "Biker", age : 35}).explain();

db.users.ensureIndex({"age" : 1});
db.users.find({profession : "Biker", age : 35}).explain();
// a query can use only one index (unless it uses $or operator)

db.users.ensureIndex({"profession" : 1, "age": 1});
db.users.find({profession : "Biker", age : 35}).explain();

// demo that shows index on {a,b} makes index on {a} redundant.
db.users.find({profession : "Biker"}).explain();
db.users.find({profession : "Biker", age : 35}).explain();
db.users.find({age : 36}).explain();

// remove redundant indexes
db.users.dropIndex({profession : 1});
// note that order of compound index matters. i.e index on {a,b} is not same as index on {b,a}

db.users.find({age : 36}).explain(); // it uses index on age so we cannot drop it.
// note that index on {profession,age} is not same as index on {age,profession}.
//------------------------------------------------------------------------------------


// embedded key indexes
db.users.find({"address.zip" : 74711}).explain();
db.users.ensureIndex({"address.zip" : 1});
db.users.find({"address.zip" : 74711}).explain();
db.users.find({"address.zip" : {$gt : 60000}}).explain();
//------------------------------------------------------------------------------------


// talk about types of indexes like unique, sparse, background indexing etc..
db.users.ensureIndex({"username" : 1}, {unique : true});
db.users.ensureIndex({"age" : 1}, {unique : true}); // can't create because of duplicate keys
db.users.ensureIndex({"age" : 1}, {unique : true, dropDups: true}); // be WARNED about deletions.
//------------------------------------------------------------------------------------


/***************************** ADVANCE INDEX TOPICS ************************************/

// index administration or DBA stuff
db.system.indexes.find();
db.users.stats(1024);
// talk about slowms option in mongod command
// talk about profiling and various profiling levels (0, 1, 2)
// for performance, your index and some working dataset has to be in RAM.
// how to do indexing or prod systems (use background indexing or take a node out of replica set, build index and plug it back in when done)
// check currently running indexing operation using db.currentOp() method.
// mention that a collection can have at most 64 indexes. talk about indexing overhead and how writes and updates or deletes become slower due to indexing.
//------------------------------------------------------------------------------------


// demo that shows "sort()" also requires index and how index cardinality matters.
db.users.ensureIndex({profession : 1});
db.users.ensureIndex({age : -1});
db.users.find({profession : "Doctor" }).sort({age : -1}).explain(true); // this doesn't use optimal index, so we can hint as given below.
// talk about cardinality, since age has more cardinality, it uses that index.
db.users.find({profession : "Doctor" }).sort({age : -1}).hint({profession :1}).explain(true);
// also talk about "scanAndOrder" flag output for above explain() commands.
//------------------------------------------------------------------------------------


// demo to show that sometimes it is better not to have an index.
db.users.find({usestwitter: true}).explain();
db.users.ensureIndex({usestwitter: 1});
db.users.find({usestwitter: true}).explain();
// the "usestwitter" field doesn't have good cardinality (it has 2). In order for an index to be useful, it should have good cardinality.
//------------------------------------------------------------------------------------


// where indexes won't be used
db.users.find({age: {$exists: true}}).explain(); // this won't use index on age even if it is present.
db.users.find({age: {$exists: false}}).explain(); // this uses index on age if it is present.
// talk about indexing when searching by regex or $ne, $nin operators.
//------------------------------------------------------------------------------------


// you cannot have a compound index having two multikeys in it.
db.users.ensureIndex({interests : 1 , "address.zip" :  1}) // throws cannot index parallel arrays [address] [interests] error.
//------------------------------------------------------------------------------------


//*************************************CHECK THIS******************/
// a weird case when you have to hint not to use an index!
db.users.dropIndexes();
db.users.find({age: {$ne: 30}}).explain();
db.users.ensureIndex({age: 1, interests: 1}); // create a compound index.
db.users.find({age: {$ne: 30}}).explain(); // this query now uses a compound index which makes it perform worse!
db.users.find({age: {$ne: 30}}).hint({_id :1}).explain(); // this is how we hint the query to not use this index.
//------------------------------------------------------------------------------------

//*************************************CHECK THIS******************/
// demo that shows queries with more than one range based criteria don't use index at all.
db.users.ensureIndex({age :1, fblikes: 1});
db.users.find({age: 45, fblikes: {$gte: 20}}).explain(); // uses above index
db.users.find({age: {$gt : 20}, fblikes: {$gte: 20}}).explain(); // this won't use index at all.
//------------------------------------------------------------------------------------

//*************************************CHECK THIS******************/
// demo to show exception to above rule. i.e. a case when it makes sense to keep both indexes {a,b} and {a}. this occurs when b is a multikey index
db.users.ensureIndex({age: 1, interests: 1});
db.users.find({age: 50}).explain();
db.users.ensureIndex({age: 1});
db.users.find({age: 50}).explain(); // if it doesn't use the index on age, hint it.
db.users.find({age: 50}).hint({age :1}).explain();
//------------------------------------------------------------------------------------

/* populate around million records of person in persons collection, and query for following:
	all persons where age is greater than some value,
	all persons where age is greater than some value and those who like gaming,
	all persons where age is greater than some value and those who don't like gaming but like programming
*/