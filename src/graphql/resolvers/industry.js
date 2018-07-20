import {gqlIndustry} from '../transformers'
import {inflateId, isHex24, getToken, validateToken, isSysUser} from '../../utils'

export default {
	Query: {
		industries: async(parent, args, {req, Industry}) => {
			const industries = await Industry.find(args)
			return industries.map(gqlIndustry)
		}
	},
	Mutation:{
		create_industry: async (parent, args, {req, Account, Industry}) => {
			const account = req.account
			if(!account)
				throw `Invalid id => "${payload._id}"`
			if(!isSysUser(account))
				throw `Not SysUser!`
			
			

			const industry = await new Industry(args).save()
			return gqlIndustry(industry)
		},

		update_industry: async (parent, args, {req, Account, Industry}) => {
			const account = req.account
			if(!isSysUser(account))
				return null
			const id = inflateId(args.industry_id)
			const industry = await Industry.findByIdAndUpdate(id, args).save()
			return gqlIndustry(industry)
		},

		remove_industry: async (parent, args, {req, Account, Industry}) => {
			const account = req.account
			if(!isSysUser(account))
				return null
			
	
			const id = inflateId(args.industry_id)
			const industry = await Industry.findByIdAndRemove(id, args).save()
			return gqlIndustry(industry)
		}
	}
}