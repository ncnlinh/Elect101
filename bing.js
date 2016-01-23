var request = require('request');
var apiBing = 'CEjg3DV9TaJCmvXliLfuFdkelGQkaleLMGZ+gzv87Wg';

var Bing = require('node-bing-api')({ accKey: apiBing });

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

searchNews("Donald Trump", "US.WA")
// var options = {
// 	url: '' + apiKey,
// 	method: 'GET'
// };

// var res = '';

// request(options, function (error, response, body) {
// 	if (!error && response.statusCode == 200) {
// 		res = body;
// 	} else {
// 		res = 'Not found';
// 	}

// 	resJSON = JSON.parse(res);

// 	console.log(resJSON);
// })