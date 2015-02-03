var q = require("q");

var usernames = ["tom", "harry", "jack"];

var getUser = function(username) {
	var deferred = q.defer();
	setTimeout(function() {
		deferred.resolve(username + " user");
	}, 1000);
	return deferred.promise;
};

var userPromises = usernames.map(getUser)

q.all(userPromises)
	.then(function(results) {
		results.forEach(function(r) {
			console.log(r);
		});
	});