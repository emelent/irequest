//GraphQL Type Definitions

export default `
type Profile {
	company: ID
	recruit: ID
}

type Account {
	_id: ID!
	email: String!
	profile: Profile!
}

type QA{
	question_id: ID!
	response: String!
}

type Question{
	_id: ID!
	question: String!
	industry_id: ID!
}

type Recruit {
	_id: String!
	name: String!
	surname: String!
	dob: String!
	province: String!
	city: String!
	gender: String!
	disability: String
	vid1_url: String!
	vid2_url: String!
	industry_id: ID!
	qa1: QA!
	qa2: QA!
	age: Int!
}

type CompanyAdmin {
	admin: ID!
	users: [ID]
}

type Company {
	_id: ID!
	name: String!
	verified: Boolean!
	industry_id: ID!
	address: String!
	email: String!
	telephone: String!
	logo_url: String
	reg_num: String
	tax_num: String
	vat_num: String
	bee_level: String
	accounts: CompanyAdmin
}

type Document {
	_id: ID!
	profile_id: ID!
	type: Int!
	url: String!
}

type Industry {
	_id: ID!
	name: String!
}


type Query {

	questions(
		industry_id: ID
	): [Question!]

	accounts(
		email: String
	): [Account!]

	company: Company
	companies(
		name: String
		verified: Boolean
		industry_id: ID
		address: String
		email: String
		telephone: String
		reg_num: String
		tax_num: String
		vat_num: String
		bee_level: String
	): [Company!]

	recruit: Recruit
	recruits(
		name: String
		surname: String
		province: String
		city: String
		disability: String
		phone: String
		dob: String
		gender: String
		industry_id: ID
		min_age: Int
		max_age: Int
	): [Recruit!]
	industries(
		name: String
	): [Industry!]

	documents(
		profile_id: ID
		type: Int
	): [Document!]
}


type Mutation {
	create_question(
		industry_id: ID!
		question: String!
	): Question
	update_question(
		question_id: ID!
		industry_id: ID
		question: String
	): Question
	remove_question(
		question_id: ID!
	): Question


	create_company(
		name: String!
		industry_id: ID!
		address: String!
		email: String!
		telephone: String!
		logo_url: String
		reg_num: String
		tax_num: String
		vat_num: String
		bee_level: String
	): Company
	update_company(
		name: String
		industry_id: ID
		address: String
		email: String
		telephone: String
		logo_url: String
		reg_num: String
		tax_num: String
		vat_num: String
		bee_level: String	
		admin: ID
		users: [ID]	
	): Company
	remove_company: Company
	

	create_recruit(
		name: String!
		surname: String!
		province: String!
		city: String!
		phone: String!
		vid1_url: String!
		vid2_url: String!
		dob: String!
		industry_id: ID!
		qa1_id: ID
		qa1_response: String
		qa2_id: ID
		qa2_response: String
		disability: String
	): Recruit
	update_recruit(
		name: String
		surname: String
		province: String
		city: String
		phone: String
		vid1_url: String
		vid2_url: String
		dob: String
		industry_id: ID
		qa1_id: ID
		qa1_response: String
		qa2_id: ID
		qa2_response: String
		
		disability: String		
	): Recruit
	remove_recruit: Recruit


	create_document(
		type: Int!
		profile_id: ID!
		url: String!
	): Document
	update_document(
		document_id: ID!
		type: Int
		url: String
	): Document
	remove_document(
		document_id: ID!
	): Document
	

	create_industry(
		name: String!
	): Industry
	update_industry(
		industry_id: ID!
		name: String!
	): Industry
	remove_industry(
		industry_id: ID
	): Industry
}

`
