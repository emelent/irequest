import express from 'express'
import {jsonResponse, getToken, createApiToken, validateToken, hashPassword, inflateId} from '../utils'


const makeRouter = ({Account, Company, Recruit}) => {
	const router = express.Router()
	router.post(`/login`, async (req, res) => {
		if (!req.body.password || !req.body.email)
			return json(res, 422, `No password or email provided.`)
		
		req.body.password = hashPassword(req.body.password)
		const account = await Account.findOne(req.body)

		if (!account)
			return jsonResponse(res, 403, `Invalid login credentials.`)

		const _id = account._id.toString()
		console.log(`_id => "${_id}`)
		const ua = req.get(`user-agent`)
		res.json(createApiToken(_id, ua))
	})

	router.post(`/signup`, async (req, res) => {
		if(!req.body.account || !(req.body.recruit || req.body.company))
			return jsonResponse(res, 422, `Invalid request format.`)
		
		const account_data = req.body.account
		account_data.password = hashPassword(account_data.password) 
		
		try{

			// prevent pre-adminifying
			req.body.account.access = 0

			const account = await new Account(req.body.account).save()
			const _id = account._id.toString()
			const ua = req.get(`user-agent`)

			if(req.body.recruit){
				req.body.recruit.qa1.question_id  = inflateId(req.body.recruit.qa1.question_id)
				req.body.recruit.qa2.question_id  = inflateId(req.body.recruit.qa2.question_id)
				const recruit = await new Recruit(req.body.recruit).save()
				account.profile.recruit = recruit._id
				
				// For some reason 'await account.save()' doesn't work
				await Account.findByIdAndUpdate(account._id, {profile: account.profile})
			}else{
				// prevent pre-verifying
				req.body.company.verified = false
				req.body.company.accounts = {
					admin: account._id,
					users: []
				}
				const company = await new Company(req.body.company).save()
				account.profile.company = company._id
				// await account.save()

				// For some reason account.save() doesn't work
				await Account.findByIdAndUpdate(account._id, {profile: account.profile})
			}

			return jsonResponse(res, 201, createApiToken(_id, ua))
		} catch(e){
			console.log(e)
			return jsonResponse(res, 401, `A user with that email already exists.`)	
		}
	})	

	router.all(`/refresh`, async (req, res) => {
		try {
			const payload = validateToken(getToken(req), {ignoreExpiration: true})
			if (payload.ua  !== req.get('user-agent')) throw ''
		
			const account = await Account.findById(inflateId(payload._id))
			if (!account) throw ''

			res.json(createApiToken(payload._id, payload.ua))
		} catch (err){
			jsonResponse(res, 403, `Invalid token.`)
		}
	})

	return router
}


export default makeRouter