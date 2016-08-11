var MongoClient = require('mongodb').MongoClient;
var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;
var dateFormat  = require('dateformat');

RouteProvider = function() {};

//Find Forward Routes
RouteProvider.prototype.findOne = function(callback)
{
    MongoClient.connect('mongodb://127.0.0.1:27017/smartxdb', function(err, db)
    {
        var currentTime = new Date();
        console.log('System Time: '+currentTime);
        dateFormat(currentTime.setMinutes(currentTime.getMinutes() - 61));
        console.log('Updated Time: '+currentTime);

        // Locate all the entries using find
        var collection = db.collection("resourcelevel-plinks");

        //collection.find({timestamp: {$gte: currentTime}},{box: true, timestamp: true, _id: false}).sort({timestamp: -1}).toArray(function(err, results)
	//collection.find().toArray(function(err, results)
        console.log(src);
        console.log(dest);
        collection.find({"source": src, "destination": dest,timestamp: {$gte: currentTime}},{timestamp: true, source: true, destination: true, hopNo: true, hopName: true, sentMessage: true, lossRate: true, averageRate: true, _id: false}).sort({hopNo: 1}).toArray(function(err, results)
	// collection.find({"source": "103.22.221.55"},{source: true, destination: true, hopNo: true, hopName: true, sentMessage: true, losssRate: true, averageRate: true, _id: false}).sort({hopNo: -1}).toArray(function(err, results)
        //collection.find({"source": "103.22.221.55", timestamp: {$gte: currentTime}},{source: true, destination: true, hopNo true, hopName true, sentMessage true, losssRate true, averageRate true, _id: false}).sort({timestamp: -1}).toArray(function(err, results)
	//collection.distinct(timestamp: {$gte: currentTime}{timestamp: {$gte: currentTime}},{source: true, destination: true, hopNo true, hopName true, sentMessage true, losssRate true, averageRate true, _id: false},function(err, results)
        {
            callback (null,results);
        });
    });
};

//Find Backward Routes
RouteProvider.prototype.findTwo = function(callback)
{
    MongoClient.connect('mongodb://127.0.0.1:27017/smartxdb', function(err, db)
    {
        var currentTime = new Date();
        console.log('System Time: '+currentTime);
        dateFormat(currentTime.setMinutes(currentTime.getMinutes() - 61));
        console.log('Updated Time: '+currentTime);

        // Locate all the entries using find
        var collection = db.collection("resourcelevel-plinks");
        collection.find({"source": dest, "destination": src, timestamp: {$gte: currentTime}},{source: true, destination: true, hopNo: true, hopName: true, sentMessage: true, lossRate: true, averageRate: true, _id: false}).sort({hopNo: 1}).toArray(function(err, results)
        {
            callback (null,results);
        });
    });
};

exports.RouteProvider = RouteProvider;
