import mongoose from 'mongoose'

const {ObjectId} = mongoose.Schema.Types;

const schema = new mongoose.Schema({
	question: {
		type: String,
		required: true
	},
	industry_id: {
		type: ObjectId,
		required: true
	}
})

module.exports = mongoose.model('Question', schema)