
// Promise fs example
var fs = require("fs");
function readFile(filename, enc) {
    return new Promise(function(fulfill, reject) {
        fs.readFile(filename, enc, function(err, res) {
            if (err) reject(err);
            else fulfill(res);
        });
    });
}
readFile("customer.json", "utf-8")
	.then(console.log, console.error)

