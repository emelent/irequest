import {gqlVenue, gqlModule} from '../transformers'
import {inflateId} from '../../utils'

export default{
	Query:{
		venues: async(parent, args, {Venue}) => {
			const venues = await Venue.find(args)
			return venues.map(gqlVenue)
		},
		venue: async (parent, args, {Venue}) => {
			const x = await Venue.findOne(args)
			return gqlVenue(x)
		}
	},
	Mutation:{
		createVenue: async (parent, args, {Venue}) => {
			const x = await new Venue(args).save()
			return gqlVenue(x)
		},
		updateVenue: async (parent, args, {Venue}) => {
			const _id = inflateId(args._id)
			delete args._id
			const x = await Venue.findByIdAndUpdate(_id, args)
			return gqlModule(x)
		},
		deleteVenue: async (parent, args, {Venue}) => {
			const _id = inflateId(args._id)
			const x = await Venue.findByIdAndRemove(_id)
			return gqlModule(x)
		}
	}
}