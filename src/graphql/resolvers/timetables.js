import {gqlTimetable} from '../transformers'
import {inflateId, setToArray} from '../../utils'
const ObjectId = require('mongoose').Types.ObjectId

export default {
	Query:{
		timetablesByModules: async(parent, args, {Timetable}) => {
			const modules = args.modules.map(inflateId)
			let timetables = []
			if (args.strict){
				timetables = await Timetable.find()
					.where('modules').size(modules.length)
			} else {
				timetables = await Timetable.find()
					.where('modules').in(modules)
			}
			return timetables.map(gqlTimetable)
		},
		timetablesByAuthor: async(parent, args, {Timetable}) => {
			const timetables = await Timetable.find({
				author_id: inflateId(args.author_id)
			})
			return timetables.map(gqlTimetable)
		},

		timetables: async(parent, args, {Timetable}) => {
			const timetables = await Timetable.find()
			return timetables.map(gqlTimetable)
		},

		resolveTimetables: async(parent, args, {Timetable}) => {
			const ids = args.modules.map(inflateId)
			const timetables = await Timetable.find().where('_id').in(ids)
			return timetables.map(gqlTimetable)
		}
	},

	Mutation:{
		createTimetable: async(parent, args, {Timetable}) => {
			//TODO use a real user id from  token
			const data = { ...args,
				author_id: ObjectId().toString()
			}
			const x = await new Timetable(data).save()
			return gqlTimetable(x)
		},

		updateTimetable: async(parent, args, {Timetable, Event}) => {
			const timetable = await Timetable.findById(inflateId(args._id))

			if (args.events) {
				//update events ObjectId array
				timetable.events = args.events.map(inflateId)

				//get actual events that match given id's
				const ids = args.events.map(inflateId)
				const events = await Event.find().where('_id').in(ids)

				const modules = events.filter(x => {
					const id = x._id.toString()
					return args.events.indexOf(id) > -1 && x.module_id
				}).map(x => x.module_id.toString())

				const moduleSet = new Set(modules)
				timetable.modules = setToArray(moduleSet).map(inflateId)
			}
			if (args.alias) {
				//update user's alias for timetable
				//requires user id
			}

			return timetable.save().then(gqlTimetable)
		}
	}
}