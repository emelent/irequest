import mongoose from 'mongoose'

const {ObjectId, Number} = mongoose.Schema.Types

const schema = new mongoose.Schema({
	type: {
		type: Number,
		required: true
	},
	profile_id: {
		type: ObjectId,
		required: true
	},
	url: {
		type: String,
		required: true,
		unique: true
	}
})

module.exports = mongoose.model('Document', schema)

