var q = require("q");

var usernames = ["tom", "harry", "jack"];

var getUser = function(username) {
	var deferred = q.defer();
	setTimeout(function() {
		deferred.resolve(username + " user");
	}, 1000);
	return deferred.promise;
};

usernames
	.map(getUser)
	.reduce(function(chain, userPromise) {
		return chain
			.then(function() {
				return userPromise;
			})
			.then(console.log)
	}, q.resolve())