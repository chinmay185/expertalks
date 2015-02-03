var q = require("q");

q.delay(1000).done(function() {
	console.log("The output is delayed by one second.");
});