import {graphqlExpress} from 'apollo-server-express'
import {makeExecutableSchema} from 'graphql-tools'

import typeDefs from '../graphql/typeDef'
import resolvers from '../graphql/resolvers'

const schema = makeExecutableSchema({
	typeDefs,
	resolvers
})

const makeGraphqlRouter = models => graphqlExpress(req => ({
	schema,
	context: {...models, req}
}))

export default makeGraphqlRouter