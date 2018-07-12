import {makeExecutableSchema} from 'graphql-tools'

import typeDefs from '../graphql/typeDef'
import resolvers from  '../graphql/resolvers'

const schema = makeExecutableSchema({
	typeDefs,
	resolvers
})

export  default schema