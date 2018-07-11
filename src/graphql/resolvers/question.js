import {gqlQuestion} from '../transformers'
import {inflateId, isHex24, getToken, validateToken, isSysUser} from '../../utils'

export default {
	Query: {
		questions: async (parent, args, {req, Question}) => {
			try{
				const payload= validateToken(getToken(req))
				if (payload.ua !== req.get('user-agent')) throw `User-Agent mismatch.`

				const account = await Question.findById(inflateId(payload._id))
				if(!isSysUser(account))
					return null
				
				args.industry_id = inflateId(args.industry_id) 
				const questions = await Question.find(args)
				return accounts.map(gqlQuestion)
			} catch(e){
				console.log(e)
				return null
			}
		}
	},
	Mutation: {
		create_question: async (parent, args, {req, Account, Question}) => {
			try{
				const payload= validateToken(getToken(req))
				if (payload.ua !== req.get('user-agent')) throw `User-Agent mismatch.`

				const account = await Account.findById(inflateId(payload._id))
				if(!isSysUser(account))
					return null
				
				args.industry_id = inflateId(args.industry_id) 
				const question  = await new Question(args).save()
				return gqlQuestion(question)
			} catch(e){
				console.log(e)
				return null
			}
		},
		update_question: async (parent, args, {req, Account, Question}) => {
			try{
				const payload= validateToken(getToken(req))
				if (payload.ua !== req.get('user-agent')) throw `User-Agent mismatch.`

				const account = await Account.findById(inflateId(payload._id))
				if(!isSysUser(account))
					return null
				const id = inflateId(args.question_id)
				if(args.industry_id)
					args.industry_id = inflateId(args.industry_id) 
				const question  = await Question.findByIdAndUpdate(id, args)
				return gqlQuestion(question)
			} catch(e){
				console.log(e)
				return null
			}
		},
		remove_question: async (parent, args, {req, Account, Question}) => {
			try{
				const payload= validateToken(getToken(req))
				if (payload.ua !== req.get('user-agent')) throw `User-Agent mismatch.`

				const account = await Account.findById(inflateId(payload._id))
				if(!isSysUser(account))
					return null
				
				const id = inflateId(args.question_id) 
				const question  = await Question.findByIdAndRemove(args)
				return gqlQuestion(question)
			} catch(e){
				console.log(e)
				return null
			}
		}
	}
}