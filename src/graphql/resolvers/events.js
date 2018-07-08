import {gqlEvent} from '../transformers'
import {inflateId, isHex24} from '../../utils'

export default {
	Query:{
		events: async(parent, args, {Event}) => {
			if (args.venue && isHex24(args.venue)){
				args.venue = inflateId(args.venue)
			}
			const events = await Event.find(args)
			return events.map(gqlEvent)
		},
		event: async(parent, args, {Event}) => {
			const x = await Event.findById(inflateId(args._id))
			return gqlEvent(x)
		},
		resolveEvents: async(parent, args, {Event}) => {
			const ids = args.modules.map(inflateId)
			const events = await Event.find().where('_id').in(ids)
			return events.map(gqlEvent)
		}
	},
	Mutation:{
		createEvent: async(parent, args, {Event}) => {
			if (args.venue && isHex24(args.venue)){
				args.venue = inflateId(args.venue)
			}
			const x = await new Event(args).save()
			return gqlEvent(x)
		},
		updateEvent: async(parent, args, {Event}) => {
			if (args.venue && isHex24(args.venue)){
				args.venue = inflateId(args.venue)
			}
			const _id = inflateId(args._id)
			delete args._id
			const x = await Event.findByIdAndUpdate(_id, args)
			return gqlEvent(x)
		},
		deleteEvent: async(parent, args, {Event}) => {
			const _id = inflateId(args._id)
			const x = await Event.findByIdAndRemove(_id)
			return gqlEvent(x)
		}
	}
}