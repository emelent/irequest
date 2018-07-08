import express from 'express'
import {getToken, createApiToken, validateToken, hashPassword, inflateId} from '../utils'


const fail = (res, code, msg) => res.status(code).json(msg)

const makeRouter = ({User}) => {
	const router = express.Router()
	router.post(`/login`, async (req, res) => {
		if (!req.body.password || !req.body.student_id)
			return fail(res, 422, `No password or student_id provided.`)
		
		req.body.password = hashPassword(req.body.password)
		const user = await User.findOne(req.body)

		if (!user)
			return fail(res, 403, `Invalid login credentials.`)

		const _id = user._id.toString()
		const ua = req.get(`user-agent`)
		res.json(createApiToken(_id, ua))
	})

	router.post(`/register`, async (req, res) => {
		if (!req.body.password || !req.body.student_id || !req.body.name)
			return fail(res, 422, `Requires name, password, student_id fields to be provided.`)
	
		req.body.password = hashPassword(req.body.password)
		
		try {
			const user = await new User(req.body).save()
			const _id = user._id.toString()
			const ua = req.get(`user-agent`)
			
			res.status(201).json(createApiToken(_id, ua))
		} catch (e){
			return fail(res, 401, `Duplicate student number.`)
		}
	})

	router.all(`/refresh`, async (req, res) => {
		try {
			const payload = validateToken(getToken(req), {ignoreExpiration: true})
			if (payload.ua  !== req.get('user-agent')) throw ''
		
			const user = await User.findById(inflateId(payload._id))
			if (!user) throw ''

			res.json(createApiToken(payload._id, payload.ua))
		} catch (err){
			fail(res, 403, `Invalid token.`)
		}
	})

	return router
}


export default makeRouter