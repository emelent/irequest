import {gqlRecruit} from '../transformers'
import {inflateId, isHex24, getToken, validateToken, isSysUser} from '../../utils'

export default {
	Query: {
		recruits: async (parent, args, {req, Company, Recruit, Account}) => {
			try{
				const payload= validateToken(getToken(req))
				if (payload.ua !== req.get('user-agent')) throw `User-Agent mismatch.`

				const account = await Account.findById(inflateId(payload._id))
				if(!isSysUser(account)){
					if(!account.profile.company)
						return null
					const company = await Company.findById(account.profile.company)
					if(!company.verified)
						return null
				}
				
				const recruits = await Recruit.find(args)

				//TODO implement filter by age
				return recruits.map(gqlRecruit)
			} catch(e){
				console.log(e)
				return null
			}
		}
	},
	Mutation: {
		create_recruit: async (parent,  args, {req, Account, Recruit})  => {
			try{
				const payload= validateToken(getToken(req))
				if (payload.ua !== req.get('user-agent')) throw `User-Agent mismatch.`

				const account = await Account.findById(inflateId(payload._id))
				if(account.profile.recruit)
					throw  `Account already has a recruit profile.`
				const recruit = await new Recruit(args).save()
				account.profile.recruit = recruit._id
				await account.save()
				return gqlRecruit(recruit)
			} catch(e){
				console.log(e)
				return null
			}
		},
		update_recruit: async (parent,  args, {req, Account, Recruit})  => {
			try{
				const payload= validateToken(getToken(req))
				if (payload.ua !== req.get('user-agent')) throw `User-Agent mismatch.`

				const account = await Account.findById(inflateId(payload._id))
				if(!account.profile.recruit)
					throw  `Account has no recruit profile.`
				
				const recruit = await Recruit.findByIdAndUpdate(account.profile.recruit, args)
				return gqlRecruit(recruit)
			} catch(e){
				console.log(e)
				return null
			}
		},
		remove_recruit: async (parent,  args, {req, Account, Recruit})  => {
			try{
				const payload= validateToken(getToken(req))
				if (payload.ua !== req.get('user-agent')) throw `User-Agent mismatch.`

				const account = await Account.findById(inflateId(payload._id))
				if(!account.profile.recruit)
					throw  `Account has no recruit profile.`
				
				const recruit = await Recruit.findByIdAndRemove(account.profile.recruit)
				account.profile.recruit = null
				await account.save()
				return gqlRecruit(recruit)
			} catch(e){
				console.log(e)
				return null
			}
		}
	}
}