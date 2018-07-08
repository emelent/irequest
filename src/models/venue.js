import mongoose from 'mongoose'

const schema = mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
		uppercase: true
	}
})
module.exports= mongoose.model('Venue', schema)