import {Router} from 'express'
import {graphqlExpress} from 'apollo-server-express'
import {inflateId, validateToken, getToken} from '../utils';
import schema from './schema'


const makeGraphqlRouter = models => {
	// authenticate user via jwt token
	const secure = async (req, res, next) => {
		try{
			const payload = validateToken(getToken(req), {ignoreExpiration: true})
			if (payload.ua !== req.get('user-agent')) throw ''
	
			const account = await models.Account.findById(inflateId(payload._id))
			if(!account) throw ''
	
			req.account = account
			req.payload = payload
			next()
		}catch(e){
			res.status(403).json('Invalid token.')
		}
	}


	const gqlRouter = Router()
	gqlRouter.use(secure) // secure the whole graphql route
	gqlRouter.use('/', graphqlExpress(req => ({
		schema,
		context: {...models, req}
	})))

	return gqlRouter
}

export default makeGraphqlRouter