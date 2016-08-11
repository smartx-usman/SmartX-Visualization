/**
 * Module dependencies.
 */

var express = require('express');
var ArticleProvider = require('./resource-mongodb').ArticleProvider;
var RouteProvider = require('./route-mongodb').RouteProvider;
var http = require("http");

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

//Define Application Routes
// index page
app.get('/index', function(req, res){
    res.render('index.jade', 
	{ title: 'Home'}
    )
});

app.get('/multiview', function(req, res){
    res.render('multiview.jade',
        { title: 'Multi View'}
    )
});

app.get('/example', function(req, res){
    res.render('example.jade',
        { title: 'Example View'}
    )
});


//Query and Draw Boxes and Path Status on Map
var articleProvider = new ArticleProvider();
app.get('/map', function(req, res){
    var bstatus;
    articleProvider.findAll( function(error,bstatus,resp)
    {
        console.log(bstatus);
        articleProvider.findPLinks( function(error,pstatus)
    	{
        res.render('map.jade', { locals: {
                    boxes: JSON.stringify(bstatus),
                    plinks: JSON.stringify(pstatus)
                 }
        });
       });
    })
});

//Draw the Traceroute Input Form
var routeProvider = new RouteProvider();
app.get('/routes', function(req, res){
    var html = 	'<form action="/route" method="get">' +
                '<table>'+
		'<tr>'+
	        '<th colspan="2" style="font-size: 18px; color: #4CAF50;"><h1>Draw Routes</h1></th>'+
		'</tr>'+
		'<tr>'+
               	'<td>Enter Source Box IP: </td>' + 
               	'<td><input type="text" name="src" placeholder="" /></td>' +
               	'</tr>'+
		'<tr>'+
	       	'<td>Enter Destination Box IP: </td>' +
	       	'<td><input type="text" name="dest" placeholder="" /></td>' +
		'</tr>'+
		'<tr>'+
		'<tr></tr>'+
		'<td></td>'+
               	'<td><button type="submit">Show</button></td>' + 
		'</tr>'+
		'</table>'+
            '</form>';
   res.send(html);
});

//Query and Draw the Traceroute
app.get('/route', function(req, res){
   var fstatus;
   src  = req.query['src'];
   dest = req.query['dest'];
   console.log(src);
   console.log(dest);
   routeProvider.findOne( function(error,fstatus)
   {
	console.log('|******************************************************|');
        console.log('|**************Forward Direction Result****************|');
        console.log(fstatus);
        console.log('|******************************************************|');
        routeProvider.findTwo( function(error,rstatus)
        {
	   console.log('|******************************************************|');
	   console.log('|**************Reverse Direction Result****************|');
	   console.log(rstatus);
	   console.log('|******************************************************|');
           res.render('routes.jade', { locals: 
		 {
                    forward: JSON.stringify(fstatus),
                    reverse: JSON.stringify(rstatus)
                 }
             });
       });
   })
});

app.set('domain', '0.0.0.0')
app.listen(3005);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
