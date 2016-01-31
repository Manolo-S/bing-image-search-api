"use strict";

var express = require('express');
var app = express();
var path = require('path');
var port = process.env.PORT || 3000;
var Search = require('bing.search');
// var util = require('util');
var search = new Search('v8IpA72Fxk92ypqkTHBssO8LgtdWslCdi7MWPW/u690');
app.use(express.static(__dirname + '/public'));

function homePage(req, res){
	res.setHeader('Content-Type', 'text/html');
	res.send('<html><head><title>Bing image search</title></head><body><p>This app provides an Bing image search API at end point: http://localhost:3000/api/imagesearch/"search string"</p></body></html>');	
}


function searchBing(req, res){
	var searchStr = req.params.searchStr;
	console.log(searchStr);
	search.images(searchStr, 
		{top: 5},
		function (err,results){
			var html = '';
			for (var i = 0; i < 5; i++){
				var picture = results[i];
				html += '<div>';
				html += '<p>' +  picture.title + '</p>';
				html += '<p>url: <a href=' + picture.url + '>' + picture.url + '</a></p>';
				html += '<p>source url: <a href=' +  picture.sourceUrl + '>' + picture.sourceUrl + '</a></p>';
				html += '</div>';
			}

			res.setHeader('Content-Type', 'text/html');
	    	res.send('<html><head><title>Bing image search</title><link rel="stylesheet" type="text/css" href="/css/style.css" /></head><body>' + html + '</body></html>');
		}
	);
}

app.get('/api/imagesearch/:searchStr', searchBing);

app.get('/', homePage);

app.listen(port);

console.log('Server running at http://127.0.0.1:' + port + '/');




 
// search.images('monkey',
//   {top: 5},
//   function(err, results) {
//     console.log(util.inspect(results, 
//       {colors: true, depth: null}));
//   }
// );