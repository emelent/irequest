//GraphQL Type Definitions

export default `
type Module {
	_id: ID!
	name: String!
	code: String!
	lessons: Int!
	period: String!
}

type Event {
	_id: ID!
	name: String!
	module_id: ID!
	day: String!
	start: String!
	end: String!
	venue: String
	language: String!
	group: String
	author_id: ID
	date: String
}

type Timetable{
	_id: ID!
	author_id: ID!
	events: [ID!]!
	modules: [ID!]!
	name: String!
}

type TimetableAlias{
	timetable_id: ID!
	alias: String!
}

type User {
	_id: ID!
	name: String!
	student_id: String!
	modules: [ID]
	active_timetable: ID
	timetables: [ID]
	timetable_aliases: [TimetableAlias]
}
type Venue {
	_id: ID!
	name: String!
}

type Query {
	# Return all venues
	venues:[Venue!]!
	# Return venue by _id or name
	venue(
		name:String
		_id: ID
	): Venue
	
	# Return module by code or _id
	module(
		_id: String
		code: String
	): Module
	# Return all modules
	modules(
		name: String
		code: String
		period: String
		lessons: Int
	): [Module]!
	# Resolve module ids
	resolveModules(
		modules: [ID]
	): [Module]!

	# Return event by _id
	event(_id:ID!): Event
	# Return events
	events(
		name: String
		module_id: ID
		day: String
		start: String
		end: String
		venue: String
		language: String
		group: String
		author_id: ID
		date: String
	):  [Event]!
	# Resolve event ids
	resolveEvents(
		events: [ID]
	): [Event]!

	# Return user by _id and/or student_id
	user(
		_id: ID
	): User
	# Return all users
	users: [User]!

	# Return timetables that have specified modules
	timetablesByModules(
		modules: [ID]!
		strict: Boolean
	): [Timetable]!

	# Return timetables by author
	timetablesByAuthor(
		author_id: ID!
	): [Timetable]!

	# Return all timetables
	timetables:[Timetable]!

	# Resolve module ids
	resolveTimetables(
		timetables: [ID]
	): [Timetable]!
}

type Mutation {
	createVenue(name:String!): Venue!
	updateVenue(
		_id: ID!
		name:String!
	): Venue
	deleteVenue(_id: ID!): Venue

	createModule(
		name: String!
		code: String!
		period: String!
		lessons: Int!
	): Module!
	updateModule(
		_id:  ID!
		name: String
		code: String
		period: String
		lessons: Int
	): Module
	deleteModule(_id: ID!): Module


	createEvent(	
		name: String!
		day: String!
		start: String!
		end: String!
		language: String!
		group: String
		venue: String
		date: String
		author_id: ID
		module_id: ID
	): Event!
	updateEvent(
		_id: ID!	
		name: String
		module_id: ID
		day: String
		venue: String
		start: String
		end: String
		language: String
		group: String
		author_id: ID
		date: String
	): Event
	deleteEvent(_id: ID!): Event

	updateUser(
		_id: ID!
		group: String
		name: String
		modules: [ID]
		timetables: [ID]
	): User
	updatePassword(
		_id: ID!
		password: String!
		new_password: String!
	): String
	deleteUser(_id: ID!): User

	createTimetable(
		name: String!
	): Timetable!
	deleteTimetable(
		_id: ID!
	): Timetable
	updateTimetable(
		_id: ID!
		events: [ID]
		alias: String
	): Timetable
	
}

`
