var request = require('request');
var http = require('http');

var stateMapping = require('./states.json')

var apiBing = 'CEjg3DV9TaJCmvXliLfuFdkelGQkaleLMGZ+gzv87Wg';
var Bing = require('node-bing-api')({ accKey: apiBing });

var myRegion;

function stateAbb(location) {
	return "US" + "." + stateMapping[location];
}

function searchNews(param, location) {
	Bing.news(param, {
		top: 10,
		skip: 0,
		newsSortBy: "Date",
		newsCategory: "rt_Politics",
		newsLocationOverride: location
	}, function(error, res, body) {
		// console.log(res);
		for (var i = 0; i < 10; i++) {
			console.log("News " + (i+1));
			console.log("Title: " + JSON.parse(JSON.stringify(body.d.results[i]))["Title"]);
			console.log("Source: " + JSON.parse(JSON.stringify(body.d.results[i]))["Url"]);
			console.log("Description: " + JSON.parse(JSON.stringify(body.d.results[i]))["Description"]);

			console.log('\n');
		}
	});
}

function findLocation() {
	http.get('http://ipinfo.io', function(res) {
		res.on('data', function (data) {
			var retval = JSON.parse(data.toString());

			myRegion = retval['region'];
			console.log(myRegion);

			searchNews("Donald Trump", stateAbb("New York"));
		});
	});
}

// searchNews("Donald Trump", stateAbb("New York"));
