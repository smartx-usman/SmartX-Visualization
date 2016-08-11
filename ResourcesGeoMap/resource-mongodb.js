var MongoClient = require('mongodb').MongoClient;
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var dateFormat  = require('dateformat');

ArticleProvider = function() {};

//Find Alive Boxes
ArticleProvider.prototype.findAll = function(callback) 
{
    MongoClient.connect('mongodb://127.0.0.1:27017/smartxdb', function(err, db)
    {
        var currentTime = new Date();
        console.log('System Time: '+currentTime);
        dateFormat(currentTime.setMinutes(currentTime.getMinutes() - 2));
//        currentTime.setHours(currentTime.getHours()+9);
        console.log('Updated Time: '+currentTime);
	// Locate all the entries using find
        var collection = db.collection("resourcelevel-performance");
       
        //collection.find({timestamp: {$gte: currentTime}},{box: true, timestamp: true, _id: false}).sort({timestamp: -1}).toArray(function(err, results)
        collection.distinct('box',{timestamp: {$gte: currentTime}},{box: true, _id: false},function(err, results)
        {
	    callback (null,results,'test');
        });
    });
};

//Find Alive Links
ArticleProvider.prototype.findPLinks = function(callback)
{
    MongoClient.connect('mongodb://127.0.0.1:27017/smartxdb', function(err, db)
    {
        var currentTime = new Date();
	console.log('System Time: '+currentTime);
        dateFormat(currentTime.setMinutes(currentTime.getMinutes() - 11));
        //currentTime.setHours(currentTime.getHours()+16);
	console.log('Current Time: '+currentTime);
        // Locate all the entries using find 16
        var collection = db.collection("resourcelevel-ppath-rt");
        //collection.find({timestamp: {$gte: currentTime}},{box: true, timestamp: true, _id: false}).sort({timestamp: -1}).toArray(function(err, results)
        collection.find({timestamp: {$gte: currentTime}},{source: true, destination: true, status: true,timestamp: true, _id: false}).sort({timestamp: -1}).toArray(function(err, results)
        {
            console.log(results);
            db.close();
            callback (null,results);
        });
    });
};

exports.ArticleProvider = ArticleProvider;
