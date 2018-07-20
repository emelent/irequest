import {gqlQuestion} from '../transformers'
import {inflateId, isHex24, getToken, validateToken, isSysUser} from '../../utils'

export default {
	Query: {
		questions: async (parent, args, {req, Account, Question}) => {
			const account = req.account
			if(!account)
				throw `Invalid id => "${payload._id}"`
			if(!isSysUser(account))
				throw `Not SysUser!`

			if(args.industry_id)
				args.industry_id = inflateId(args.industry_id) 
				
			const questions = await Question.find(args)
			return questions.map(gqlQuestion)
		}
	},

	Mutation: {
		create_question: async (parent, args, {req, Account, Question}) => {
			const account = req.account
			if(!isSysUser(account))
				return null
			
			args.industry_id = inflateId(args.industry_id) 
			const question  = await new Question(args).save()
			return gqlQuestion(question)
		},

		update_question: async (parent, args, {req, Account, Question}) => {
			const account = req.account
			if(!isSysUser(account))
				return null
			const id = inflateId(args.question_id)
			if(args.industry_id)
				args.industry_id = inflateId(args.industry_id) 
			const question  = await Question.findByIdAndUpdate(id, args)
			return gqlQuestion(question)
		},

		remove_question: async (parent, args, {req, Account, Question}) => {
			const account = req.account
			if(!isSysUser(account))
				return null
			
			const id = inflateId(args.question_id) 
			const question  = await Question.findByIdAndRemove(args)
			return gqlQuestion(question)
		}
	}
}