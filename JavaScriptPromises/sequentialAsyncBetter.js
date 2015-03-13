var q = require("q");

var usernames = ["tom", "harry", "jack"];

var getUser = function(username) {
	var deferred = q.defer();
	setTimeout(function() {
		if (username === "harry") {
			deferred.reject('sorry harry');
		}
		deferred.resolve(username + " user");
	}, 1000);
	return deferred.promise;
};

usernames.reduce(function(all, user) {
	return all.then(function() {
			return getUser(user);
		})
		.then(console.log)
		.catch(console.log);
}, q.resolve())
