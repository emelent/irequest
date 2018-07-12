import mongoose from 'mongoose'

const {ObjectId} = mongoose.Schema.Types;


const schema = new mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	verified: {
		type: Boolean,
		default: false
	},
	industry_id: {
		type: ObjectId,
		required: true
	},
	address: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	telephone: {
		type: String,
		required: true
	},
	website_url: {
		type: String
	},
	logo_url:  {
		type: String
	},
	reg_num: {
		type: String
	},
	tax_num: {
		type: String
	},
	vat_num: {
		type: String
	},
	bee_level:{
		type: String
	},
	accounts: {
		type: Object,
		default: {
			admin: null,
			users: []
		},
		required: true
	}
})

module.exports = mongoose.model('Company', schema)