import mongoose from 'mongoose'

const {ObjectId} = mongoose.Schema.Types;

const Profile = new mongoose.Schema({
	business: {
		type: ObjectId,
	},
	recruit: {
		type: ObjectId
	}
})

const schema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	access:{
		type: Number,
		required: true,
		default: 0
	},
	profile: {
		type: Object,
		default: {
			company: null,
			recruit: null
		}
	}
})

module.exports = mongoose.model('Account', schema)