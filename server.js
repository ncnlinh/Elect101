var request = require('request');
var Twitter = require('Twitter');


var profile = {
    title: "",
    first_name: "",
    last_name: "",
    facebook: [],
    twitter: [],
    youtube: [],
    website: "",
    party: "",
    chamber: "",
    state: "",
    dob: "",
    topDonators: [],
    topKeyWords: [],
    crp_id: "",
    bioguide_id: "",
    propic_url: "",
    youtube_videos: []
};

//searchWithZipCode(30345);
searchWithName("Mitch", "McConnell");

function searchWithZipCode(zipcode) {
    var sunlightCongressURL = {
        host: "https://congress.api.sunlightfoundation.com", 
        parameter: "/legislators/locate?zip=" + zipcode + "&apikey=" + api_key_sunlight
    };


    request(sunlightCongressURL.host + sunlightCongressURL.parameter, function (error, response, body) {
        if (error) {
            console.log(error);
        }
        if (!error && response.statusCode == 200) {
            console.log(JSON.parse(body).results);
        }
    });
}

function searchWithName(first_name, last_name) {
    var sunlightCongressURL = {
        host: "https://congress.api.sunlightfoundation.com" ,
        parameter: "/legislators?first_name=" + first_name 
            + "&last_name=" + last_name 
            + "&apikey=" + api_key_sunlight
    };

    request(sunlightCongressURL.host + sunlightCongressURL.parameter, function (error, response, body) {
        if (error) {
            console.log(error);
        }
        if (!error && response.statusCode == 200) {
            var json = JSON.parse(body).results[0];
            console.log(json);
            parse(json);
        }
    });
}

function parse(json) {
    //Website
    if (json.website !== null) {
        profile.website = json.website;
    }

    //Party
    if (json.party === "D") {
        profile.party = "Democrat";
    } else if (json.party === "R") {
        profile.party = "Republican";
    } else if (json.party === "I") {
        profile.party = "Independent";
    } else {
        profile.party = "Unknown";
    }


    profile.chamber = 
        json.chamber.charAt(0).toUpperCase() + json.chamber.slice(1);
    profile.state = json.state_name;
    profile.dob = json.birthday;
    profile.title = json.title;
    profile.crp_id = json.crp_id;
    profile.bioguide_id = json.bioguide_id;


    //Facebook
    profile.facebook.push({id: json.facebook_id});
    if (json.facebook_id !== null) {
        profile.facebook.push(
            {link: "http://www.facebook.com/" + json.facebook_id});
    } else {
        profile.facebook.push({link: null});
    }

    //Twitter
    profile.twitter.push({id: json.twitter_id});
    if (json.twitter_id !== null) {
        profile.twitter.push(
            {link: "http://www.twitter.com/" + json.twitter_id});
    } else {
        profile.twitter.push({link: null});
    }

    //Youtube
    profile.youtube.push({id: json.youtube_id});
    if (json.youtube_id !== null) {
        profile.youtube.push(
            {link: "http://www.youtube.com/" + json.youtube_id});
    } else {
        profile.youtube.push({link: null});
    }
    
    getFacebookLikes();
    getTwitterFollowers();
    getYoutubeSubsAndViewCount();
    getYoutubeVideos();
    getProPicUrl();
}

function getFacebookLikes() {
    var id = profile.facebook[0].id;
    if (id !== null) {
        var url = "https://graph.facebook.com/" + id 
        + "?fields=likes.limit(1).summary(true)&access_token="
        + api_key_facebook + "&__mref=message";

        request(url, function (error, response, body) {
            if(!error && response.statusCode == 200) {
                console.log("Successful Facebook");
                var json = JSON.parse(body);
                profile.facebook.push({likes: json.likes});
                console.log("Likes: " + json.likes);
            }
        });
    }
}

function getTwitterFollowers() {
    var id = profile.twitter[0].id;
    if (id !== null) {
        client.get("users/show", {screen_name: id}, function(error, result, response) {
            if(!error && response.statusCode == 200) {
                console.log("Successful Twitter");
                profile.twitter.push({followers_count: result.followers_count});
                console.log("Followers: " + result.followers_count);
            }
        });
    }
}


function getYoutubeSubsAndViewCount() {
    var id = profile.youtube[0].id;
    if (id !== null) {
        var url = "https://www.googleapis.com/youtube/v3/channels?part=statistics&forUsername=" + id + 
            "&key=" + api_key_youtube;

        request(url, function (error, response, body) {
            if(!error && response.statusCode == 200) {
                console.log("Successful Youtube");
                var json = JSON.parse(body);
                profile.youtube.push({subCount: json.items[0].statistics.subscriberCount});
                profile.youtube.push({viewCount: json.items[0].statistics.viewCount});
                console.log("Subs: " + json.items[0].statistics.subscriberCount);
                console.log("View: " + json.items[0].statistics.viewCount);
            }
        });
    }
}


function getTopKeyWords(count) {
    var url = "http://capitolwords.org/api/1/phrases.json?entity_type=legislator&entity_value=" 
        + profile.bioguide_id + "&sort=count desc&apikey=" + api_key_sunlight;
    request(url, function (error, response, body) {
        if(!error && response.statusCode == 200) {
            var json = JSON.parse(body);
            for (var i = 0; i < count; i++) {
                if (json[i] !== undefined) {
                    profile.topKeyWords.push({
                        word: json[i].ngram,
                        frequency: json[i].count
                    });
                }
            }
        }
    });
}

function getTopDonators(count) {
    var url = "http://www.opensecrets.org/api/?method=candContrib&cid=" 
        + profile.crp_id + "&cycle=2016&output=json&apikey=" + api_key_open_secrets;

    request(url, function (error, response, body) {
        if(!error && response.statusCode == 200) {
            body = JSON.parse(body);
            for (var i = 0; i < count; i++) {
                if (body.response.contributors.contributor[i] !== undefined) {
                    profile.topDonators.push( {
                        org_name: body.response.contributors.contributor[i]["@attributes"].org_name,
                        amount: body.response.contributors.contributor[i]["@attributes"].total
                    });
                }
            }
        }
    });
}

function getYoutubeVideos() {
}

function getProPicUrl() {
}

