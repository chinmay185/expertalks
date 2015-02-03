var q = require("q");

var usernames = ["tom", "harry", "jack"];

var getUser = function(username) {
	var deferred = q.defer();
	setTimeout(function() {
		deferred.resolve(username + " user");
	}, 1000);
	return deferred.promise;
};

var print = function(name) {
	console.log(name);
};

getUser(usernames[0])
	.then(print)
	.then(function() {
		return getUser(usernames[1]);
	})
	.then(print)
	.then(function() {
		return getUser(usernames[2]);
	})
	.then(print);