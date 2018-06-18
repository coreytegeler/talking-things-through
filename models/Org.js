const mongoose = require('mongoose')

let OrgSchema = new mongoose.Schema({
	title: String,
	slug: {
		type: String,
		unique: true
	},
	description: String,
	blurb: String,	
});

module.exports = mongoose.model('Org', OrgSchema)