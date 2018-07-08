import events from './events'
import modules from './modules'
import venues from './venues'
import users from './users'
import timetables from './timetables'

const resolvers = [
	modules,
	events,
	venues,
	users,
	timetables
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