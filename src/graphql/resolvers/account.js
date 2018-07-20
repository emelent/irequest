import {gqlAccount} from '../transformers'
import {inflateId, isHex24, getToken, validateToken, isSysUser} from '../../utils'

export default {
	Query: {
		accounts: async (parent, args, {req, Account}) => {
			if(!isSysUser(req.account))
				return null
			
			const accounts = await Account.find(args)
			return accounts.map(gqlAccount)
		}
	}
}