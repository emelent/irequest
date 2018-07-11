import mongoose from  'mongoose'

const {ObjectId} = mongoose.Schema.Types

const QAR = new mongoose.Schema({
	qa_id: {
		type: ObjectId,
		required: true
	},
	response: {
		type: String,
		required: true
	}
})

const schema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	surname: {
		type: String,
		required: true
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