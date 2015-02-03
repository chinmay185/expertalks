var fs = require("fs");
var q = require("q");

function readFile(filename, enc) {
	var deferred = q.defer();
	fs.readFile(filename, enc, function(err, res) {
		if (err) deferred.reject(err);
		else deferred.resolve(res);
	});
	return deferred.promise;
}

readFile("customer.json", "utf-8")
	.then(function(data) {
		console.log("file data: " + data);
	}
	.catch(function(err) {
		console.error("new error :" + err);
	});