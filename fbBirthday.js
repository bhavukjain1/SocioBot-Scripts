var graph = require('fbgraph');
var giphy = require('giphy-api')();
// var CronJob = require('cron').CronJob;

// Use Your Facebook Access Token Here
var access_token = "";

graph.setAccessToken(access_token);

var fbBirthday = {

	getAllFriends: function() {
		graph.get("me/friends?fields=birthday&limit=1000", function(err, res) {
  			// returns the post id 
  			var data = res["data"];
  			var ids = getTodayBirthday(data);
  			ids.forEach(function(id) {
  				getGif(id);
  			});
  			
  			// console.log(data.length); // { id: xxxxx} 
  		});
	}
};


function postOnWall(message,link,userId) {

	var wallPost = {
		message: message,
		link: link
	};

	graph.post(userId + "/feed", wallPost, function(err, res) {
  			// returns the post id 
  			console.log(res); // { id: xxxxx} 
  		});
}


function getGif(userId) {

	var rand = Math.floor(Math.random()*200) + 1;
	var message = "Happy b'day!";
	giphy.search({
		q: 'cake',
		limit:1,
		offset:rand,
		rating: 'pg-13'
	}, function (err, res) {
    // Res contains gif data! 
    var data = res.data;
    var firstVideo = data[0];
    var url = firstVideo.url;

    postOnWall(message,url,userId);
});
}

function getTodayBirthday(friendsArray) {

	var ids = Array();

	friendsArray.forEach(function(friend) {
		var id = friend.id;
		try{
			var birthday = friend.birthday;
		}catch(err){
			return true;
		}
		
		var today = new Date();
		var todayDate = today.getDate();
		var todayMonth = today.getMonth() + 1;

		var birthdate = new Date(birthday);
		var friendBirthdayDate = birthdate.getDate();
		var friendBirthdayMonth = birthdate.getMonth() + 1;

		if (todayDate == friendBirthdayDate && todayMonth == friendBirthdayMonth) {
			ids.push(id);
		}
	});

	return ids;
}
module.exports = fbBirthday;

