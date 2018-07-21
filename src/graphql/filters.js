import {cleanObj, regxContains, regxStartsWith, currentYear, regxCaseInsensitive} from '../utils'

export const filterRecruit = (args) => {
	// setup queries
	const data = cleanObj(args)
	const query = {}
	// check data
	if(data.hasOwnProperty('gender')){
		query.gender = regxCaseInsensitive(data.gender)
	}
	if(data.hasOwnProperty('industry_id')){
		query.industry_id = data.industry_id
	}
	if(data.hasOwnProperty('name')){
		query.name = regxContains(data.name)
	}
	if(data.hasOwnProperty('surname')){
		query.surname = regxContains(data.name)
	}
	if(data.hasOwnProperty('province')){
		query.province = regxStartsWith(data.province)
	}
	if(data.hasOwnProperty('city')){
		query.city = regxContains(data.city)
	}
	if(data.hasOwnProperty('disability')){
		query.disability = regxContains(data.disability)
	}

	if(data.hasOwnProperty('min_age')){
		query.dob = {
			$lt: new Date(String(currentYear() - data.min_age))
		}
	}
	if(data.hasOwnProperty('max_age')){

		const d = new Date(String(currentYear() - data.max_age))
		if(query.hasOwnProperty('dob')){
			query.dob.$gt = d
		}else{
			query.dob = {$gt: d}
		}
	}
	return query
}