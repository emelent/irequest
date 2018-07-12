import {graphqlExpress} from 'apollo-server-express'
import schema from './schema'

const makeGraphqlRouter = models => graphqlExpress(req => ({
	schema,
	context: {...models, req}
}))

export default makeGraphqlRouter