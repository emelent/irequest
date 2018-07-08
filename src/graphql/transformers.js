//=========================
// Transformer Functions
//
// These functions transform the given model to the form required
// by the graphql schema created. This is mostly transforming
// ObjectId types to strings.
//=========================
export const gqlEvent = x => {
	if (!x) return
	x._id = x._id.toString()
	if (x.module_id)
		x.module_id = x.module_id.toString()
	if (x.date)
		x.date = x.date.toString()
	if (x.author_id)
		x.author_id = x.author_id.toString()
	if (x.venue)
		x.venue = x.venue.toString()

	return x
}
export const gqlModule = x => {
	if (!x) return
	x._id = x._id.toString()
	return x
}

export const gqlUser = x => {
	if (!x) return
	x._id = x._id.toString()
	x.modules = x.modules.map(y => y.toString())
	x.timetables = x.timetables.map(y => y.toString())
	x.timetable_aliases = x.timetable_aliases.map(y => ({
		timetable_id: y.timetable_id.toString(),
		alias: y.alias
	}))
	if (x.active_timetable)
		x.active_timetable = x.active_timetable.toString()
	
	return x
}

export const gqlTimetable = x => {
	if (!x) return
	x._id = x._id.toString()
	x.author_id = x.author_id.toString()
	if (x.events)
		x.events = x.events.map(y => y.toString())
	if (x.modules)
		x.modules = x.modules.map(y => y.toString())
	return x
}

export const gqlVenue = x => {
	if (!x) return
	x._id = x._id.toString()
	return x
}
