import {gqlModule} from '../transformers'
import {inflateId} from '../../utils'

export default {
	Query:{
		modules: async(parent, args, {Module}) => {
			const modules = await Module.find(args)
			return modules.map(x => gqlModule(x))
		},
		resolveModules: async(parent, args, {Module}) => {
			console.log('args =>',  args)
			const ids = args.modules.map(inflateId)
			console.log('module id =>', ids)
			const modules = await Module.find().where('_id').in(ids)
			console.log('modules =>',  modules)
			return modules.map(gqlModule)
		},
		module: async(parent, args, {Module}) => {
			const x = await Module.findOne(args)
			return gqlModule(x)
		}
	},
	Mutation: {
		createModule: async(parent, args, {Module}) => {
			const x = await new Module(args).save()
			return gqlModule(x)
		},
		updateModule: async(parent, args, {Module}) => {
			const _id = inflateId(args._id)
			delete args._id
			const x = await Module.findByIdAndUpdate(_id, args)
			return gqlModule(x)
		},
		deleteModule: async(parent, args, {Module}) => {
			const _id = inflateId(args._id)
			const x = await Module.findByIdAndRemove(_id)
			return gqlModule(x)
		}
	}
}