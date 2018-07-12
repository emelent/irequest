//=========================
// Transformer Functions
//
// These functions transform the given model to the form required
// by the graphql schema created. This is mostly transforming
// ObjectId types to strings.
//=========================

const flattenId = model => {
	if(!x) return
	x._id = x._id.toString()
	return x
}

export const gqlAccount = account => account
export const gqlCompany = company => company
export const gqlDocument = doc => doc
export const gqlIndustry = industry => industry
export const gqlRecruit = recruit => {
	
	recruit.age = new Date().getFullYear() - recruit.dob.getFullYear()
	recruit.dob = recruit.dob.toDateString()
	return recruit
}
export const gqlQuestion = question => question


