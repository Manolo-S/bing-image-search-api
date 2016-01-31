"use strict";

var express = require('express');
var app = express();
var path = require('path');
var port = process.env.PORT || 3000;
var Search = require('bing.search');
var search = new Search('');
var mongoose = require('mongoose');
var db = mongoose.connect('mongodb://x:x@ds049854.mongolab.com:49854/bing-image-search');
var Schema = mongoose.Schema;

var bingImageSchema = new Schema ({
	searchStr: {type: String},
	dateTime: {type: String}
});

var bingImageModel = mongoose.model('bingImage', bingImageSchema);


app.use(express.static(__dirname + '/public'));

function homePage(req, res){
	res.setHeader('Content-Type', 'text/html');
	res.send('<html><head><title>Bing image search</title></head><body><p>This app provides a Bing image search API at end point: http://localhost:3000/api/imagesearch/"search string"</p><p>Last 10 searches available through /api/latest/imagesearch</p></body></html>');	
}

function storeSearchStr (searchStr, dateTime){
	bingImageModel.create({
							searchStr: searchStr,
							dateTime: dateTime
						});
}

function searchHistory(req, res) {
	var res = res;
	var query = bingImageModel.find({});
	query.sort({_id: -1});
	query.limit(10);

	query.exec(function (err, docs){
		var html = "<h1>Last 10 searches</h1>";
		docs.map(function(doc){
			html += '<div><p>';
			html += '<span>' + doc.searchStr + '</span>';
			html += '  ';
			html += doc.dateTime;
			html += '</p></div>';
		});
		res.setHeader('Content-Type', 'text/html');
	    res.send('<html><head><title>Bing image search</title><link rel="stylesheet" type="text/css" href="/css/style.css" /></head><body>' + html + '</body></html>');
	});
}


function searchBing(req, res){
	var searchStr = req.params.searchStr;
	console.log(searchStr);
	var dateTime = String(new Date());
	storeSearchStr(searchStr, dateTime);
	search.images(searchStr, 
		{top: 10},
		function (err,results){
			var html = '';
			for (var i = 0; i < 10; i++){
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

app.get('/api/latest/imagesearch', searchHistory);

app.get('/', homePage);

app.listen(port);

console.log('Server running at http://127.0.0.1:' + port + '/');
