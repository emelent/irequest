import account from './account'
import company from './company'
import document from './document'
import industry from './industry'
import question from './question'
import recruit from './recruit'

const resolvers = [
	account,
	company,
	document,
	industry,
	question,
	recruit
]

const makeMutation = resolvers => resolvers.reduce(
	(mutations, {Mutation}) => ({...mutations, ...Mutation}),
	{}
)

const makeQuery = resolvers => resolvers.reduce(
	(queries, {Query}) => ({...queries, ...Query}),
	{}
)


const rootResolver = {
	Query: makeQuery(resolvers),
	Mutation: makeMutation(resolvers)
}

export default rootResolver