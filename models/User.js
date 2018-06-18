const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose');

let UserSchema = new mongoose.Schema({
	name: String,
	email: {
		type: String,
		required: true,
		unique: true
	},
	provider: String,
	provider_id: String,
	token: String,
	provider_pic: String,
	followingOrg: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Org'
	}],
	followingCourse: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Course'
	}]
})

UserSchema.methods.follow = function (type, id) {
	if (this['following'+type].indexOf(id) === -1) {
		this['following'+type].push(id)
	}
	return this.save()
}

UserSchema.plugin(passportLocalMongoose, {
	usernameField: 'email',
  usernameQueryFields: ['email'],
  usernameLowerCase: true
})

module.exports = mongoose.model('User', UserSchema)