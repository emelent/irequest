import express from 'express'
import {graphiqlExpress} from 'apollo-server-express'
import bodyParser from 'body-parser'

import models from '../models'
import makeAuthRouter from './auth'
import makeGraphqlRouter from './graphql'
import { inflateId, validateToken, getToken} from '../utils';

//cors middleware
const cors = (req, res, next) => {
	res.set('Access-Control-Allow-Origin', '*')
	res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With')
	res.set('Content-Type', 'application/json')

	if (req.method === 'OPTIONS') return res.sendStatus(200)
	next()
}

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

const app = express()

// attach middleware
app.use(cors)
app.use(bodyParser.json())

//attach authentication router
app.use('/auth', makeAuthRouter(models))

//attach graphql router
app.use('/graphql', makeGraphqlRouter(models))

//attach graphiql
app.use('/graphiql', graphiqlExpress({endpointURL: '/graphql'}))

//dummy route
if (process.env.NODE_ENV !== 'production'){
	app.all('/', (req, res) => {
		res.status(200).json(`Well, hello there in Tibet.`)
	})
}

export default app