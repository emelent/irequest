import mongoose from  'mongoose'

const {ObjectId} = mongoose.Schema.Types

const schema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	surname: {
		type: String,
		required: true
	},	
	rsa: {
		type: Boolean,
		required: true
	},
	gender: {
		type: String,
		required: true,
		lowercase: true,
		default: "male"
	},
	province: {
		type: String,
		required: true
	},
	city: {
		type: String,
		required: true
	},
	disability: {
		type: String
	},
	phone: {
		type: String,
		required: true
	},
	vid1_url: {
		type: String,
		required: true
	},
	vid2_url: {
		type: String,
		required: true
	},
	dob: {
		type: Date,
		required: true
	},
	industry_id: {
		type: ObjectId,
		required: true
	},
	qa1: {
		type: Object,
		default: {
			question_id: null,
			response: null
		},
		required: true
	},
	qa2: {
		type: Object,
		default: {
			question_id: null,
			response: null
		},
		required: true
	}
})

module.exports = mongoose.model('Recruit', schema)