var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var photoSchema = new Schema({
	'name' : String,
	'path' : String,
	'postedBy' : String,
	'peopleWhoLiked' : String,
	'likes' : Number,
	'date' : String,
	'reports': Number
});

module.exports = mongoose.model('photo', photoSchema);
