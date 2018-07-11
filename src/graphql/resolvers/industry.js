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
			try{
				const payload= validateToken(getToken(req))
				if (payload.ua !== req.get('user-agent')) throw `User-Agent mismatch.`
				
				const account = await Account.findById(inflateId(payload._id))
				if(!account)
					throw `Invalid id => "${payload._id}"`
				if(!isSysUser(account))
					throw `Not SysUser!`
				
				

				const industry = await new Industry(args).save()
				return gqlIndustry(industry)
			} catch(e){
				console.log(e)
				return null
			}
		},
		update_industry: async (parent, args, {req, Account, Industry}) => {
			try{
				const payload= validateToken(getToken(req))
				if (payload.ua !== req.get('user-agent')) throw `User-Agent mismatch.`

				const account = await Account.findById(inflateId(payload._id))
				if(!isSysUser(account))
					return null
				const id = inflateId(args.industry_id)
				const industry = await Industry.findByIdAndUpdate(id, args).save()
				return gqlIndustry(industry)
			} catch(e){
				console.log(e)
				return null
			}
		},
		remove_industry: async (parent, args, {req, Account, Industry}) => {
			try{
				const payload= validateToken(getToken(req))
				if (payload.ua !== req.get('user-agent')) throw `User-Agent mismatch.`

				const account = await Account.findById(inflateId(payload._id))
				if(!isSysUser(account))
					return null
				
		
				const id = inflateId(args.industry_id)
				const industry = await Industry.findByIdAndRemove(id, args).save()
				return gqlIndustry(industry)
			} catch(e){
				console.log(e)
				return null
			}
		}
	}
}