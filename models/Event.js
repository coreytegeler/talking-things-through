const mongoose = require('mongoose')

let EventSchema = new mongoose.Schema({
	title: String,
	slug: {
		type: String,
		unique: true
	},
	description: String,
	blurb: String,
	org: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Org'
	},
});

module.exports = mongoose.model('Event', EventSchema)