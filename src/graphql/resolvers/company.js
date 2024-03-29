import {gqlCompany} from '../transformers'
import {inflateId, getToken, validateToken, isSysUser} from '../../utils'

export default {
	Query: {
		company: async (parent, args, {req, Company, Account}) => {
			const account = req.account
			if(!account.profile.company)
				throw `Account has no linked company profile.`

			const company = await Company.findById(account.profile.company)
			return gqlCompany(company)
		},

		companies: async (parent, args, {req, Company, Account}) => {
			const account = req.account
			if(!isSysUser(account))
				throw `Not a SysUser.`
			const companies = await Company.find(args)
			return companies.map(gqlCompany)
		}
	},
	Mutation: {
		create_company:async  (parent, args,  {req, Account, Company}) => {
			const account = req.account
			if(account.profile.company) throw `Account can only manage one company profile.`

			args.industry = inflateId(args.industry)
			const company = await new Company(args).save()
			company.accounts.admin = account._id
			account.profile.company = company._id

			await company.save()
			await account.save()
			return gqlCompany()
		},

		update_company: async(parent, args, {req, Account, Company}) => {
			const account = req.account
			if(account.profile.company) 
				throw `Account has no linked company profile.`
			
			if(args.industry)
				args.industry = inflateId(args.industry)
			
			const company = await Company.findByIdAndUpdate(account.profile.company, args)

			if(args.admin)
				company.accounts.admin = inflateId(args.admin)
			if(args.users)
				company.accounts.users = args.users.map(inflateId)
			await company.save()
			return gqlCompany(company)
		
		},
		
		remove_company: async(parent,  args, {req,  Account, Company}) => {
			const account = req.account
			if (!account.profile.company)
				throw `Account is not linked to a business profile.`
			
			const company = await Company.findByIdAndRemove(account.profile.company)
			account.profile.company = null
			await account.save()
			return gqlCompany(company)
		}
	}
}