db.users.dropIndexes();
db.users.drop();

var populateInterests = function() {
	var interestsArray = ["programming", "music", "gaming", "mongodb", "dancing", "reading"];
	var userInterests = new Array();
	for (var i = 0; i < 5; i++) {
		var rand = Math.floor((Math.random()*interestsArray.length));
		if (!contains(userInterests, interestsArray[rand])) 
			userInterests.push(interestsArray[rand])
	}
	return userInterests;
};

var contains = function(array, element) {
	var found = false;
	for (var i = 0; i < array.length; i++) {
		if (array[i] === element) {
			found = true;
		 	break;
		}
	}
	return found;
};

var populateProfession = function() {
	var professionsArray = ["Doctor", "Engineer", "Scientist", "Programmer", "Biker", "Player"];
	return professionsArray[Math.floor((Math.random()*professionsArray.length))];
};

var populateCity = function() {
	var citiesArray = ["Pune", "Mumbai", "London", "Paris", "Vienna", "Bangalore"];
	return citiesArray[Math.floor((Math.random()*citiesArray.length))];
};

var populateZip = function() {
	return Math.floor(Math.random() * (80000 - 50000)) + 50000;
};

var populateAge = function() {
	return Math.floor(Math.random() * (60 - 25)) + 25;
};

var populateFbLikes = function() {
	return Math.floor(Math.random() * 500);
};

var populateUsesTwitter = function() {
	return Math.random() > 0.05;
};

var generatePhoneNumber = function() {
	return Math.floor(Math.random() * (9876543210 - 9012345678)) + 9012345678;
};

for (i=0; i < 200000; i++) {
	db.users.insert({
	username : "username"+i,
	name : "Name" + i,
	email : "username" + i + "@company.com",
	profession : populateProfession(),
	age: populateAge(),
	fblikes: populateFbLikes(),
	usestwitter: populateUsesTwitter(),
	interests: populateInterests(),
	phone : {
		home: generatePhoneNumber(),
		office: generatePhoneNumber(),
		mobile: generatePhoneNumber()
	},
	address: [
		{
			type: "home",
			street: "home_address_street" + i,
			city: populateCity(),
			zip: populateZip()
		},
		{
			type: "office",
			street: "office_address_street" + i,
			city: populateCity(),
			zip: populateZip()
		}
	]
	});
}
