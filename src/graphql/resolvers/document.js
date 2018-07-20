import {gqlDocument} from '../transformers'
import {inflateId, getToken, validateToken, isSysUser} from '../../utils'

export default {
	Query: {
		documents: async (parent, args, {req, Account, Company, Document}) => {
			const account = req.account
			const profileId = inflateId(args.profile)

			if(!isSysUser(account)){
				if(account.profile.recruit != profileId){
					return null
				}else if(account.profile.company){
					const company = await Company.findById(account.profile.company)
					if(!company.verified)
						return null
				}
			}
				
			
			const docs = await Document.find(args)
			return docs.map(gqlDocument)
		}
	},
	Mutation: {
		create_document: async (parent, args, {req, Account, Company, Document}) => {
			const account = req.account
			const profileId = inflateId(args.profile)

			if(!isSysUser(account)){
				if(account.profile.recruit != profileId){
					return null
				}else if(account.profile.company != profileId){
					return null
				}
			}
				
			const doc = await new Document({
				profile: profileId,
				type: args.type,
				url: args.url
			}).save()
			return gqlDocument(doc)
		},

		update_document: async (parent, args, {req, Account, Company, Document}) => {
			const account = req.account
			const docId = inflateId(args.document_id)

			if(!isSysUser(account)){
				if(account.profile.recruit != profileId){
					return null
				}else if(account.profile.company != profileId){
					return null
				}
			}
				
			const doc = await Document.findByIdAndUpdate(docId, args).save()
			return gqlDocument(doc)
		},
		
		remove_document: async (parent, args, {req, Account, Company, Document}) => {
			const account = req.account
			const docId = inflateId(args.document_id)

			if(!isSysUser(account)){
				if(account.profile.recruit != profileId){
					return null
				}else if(account.profile.company != profileId){
					return null
				}
			}
				
			const doc = await Document.findByIdAndRemove(docId, args).save()
			return gqlDocument(doc)
		},
		
	}
}