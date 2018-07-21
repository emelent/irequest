import {gqlRecruit} from '../transformers'
import {inflateId, isHex24, getToken, validateToken, isSysUser, cleanObj, regxContains, currentYear, regxStartsWith} from '../../utils'
import { filterRecruit } from '../filters';

export default {
	Query: {
		recruit: async (parent, args, {req, Recruit}) => {
			const account = req.account
			if(!account.profile.recruit)
				throw `Account has no linked recruit profile.`

			const recruit = await Recruit.findById(account.profile.recruit)
			return gqlRecruit(recruit)
		},
		recruits: async (parent, args, {req, Company, Recruit}) => {
			const account = req.account
			if(!isSysUser(account)){
				if(!account.profile.company)
					return null
				const company = await Company.findById(account.profile.company)
				if(!company.verified)
					return null
			}
			
			if(args.qa1_id){
				args.qa1 = {
					question_id: inflateId(args.qa1_id),
					response: args.qa1_response
				}
			}
			if(args.qa2_id){
				args.qa2 = {
					question_id: inflateId(args.qa2_id),
					response: args.qa2_response
				}
			}
			console.log(args)
			const recruits = await Recruit.find(filterRecruit(args))

			return recruits.map(gqlRecruit)
		}
	},
	Mutation: {
		create_recruit: async (parent,  args, {req, Recruit})  => {
			const account = req.account
			if(account.profile.recruit)
				throw  `Account already has a recruit profile.`
			args.industry_id = inflateId(industry_id)
			args.qa1 = {
				question_id: inflateId(args.qa1_id),
				response: args.qa1_response
			}
			
			args.qa2 = {
				question_id: inflateId(args.qa2_id),
				response: args.qa2_response
			}
			
			
			const recruit = await new Recruit(args).save()
			account.profile.recruit = recruit._id
			await account.save()
			return gqlRecruit(recruit)
		},

		update_recruit: async (parent,  args, {req, Recruit})  => {
			const account = req.account
			if(!account.profile.recruit)
				throw  `Account has no recruit profile.`
			
			const recruit = await Recruit.findByIdAndUpdate(account.profile.recruit, args)
			return gqlRecruit(recruit)
		},

		remove_recruit: async (parent,  args, {req, Recruit})  => {
			const account = req.account
			if(!account.profile.recruit)
				throw  `Account has no recruit profile.`
			
			const recruit = await Recruit.findByIdAndRemove(account.profile.recruit)
			account.profile.recruit = null
			await account.save()
			return gqlRecruit(recruit)
		}
	}
}