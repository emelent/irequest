import {gqlAccount} from '../transformers'
import {inflateId, isHex24, getToken, validateToken, isSysUser} from '../../utils'

export default {
	Query: {
		accounts: async (parent, args, {req, Account}) => {
			try{
				const payload= validateToken(getToken(req))
				if (payload.ua !== req.get('user-agent')) throw `User-Agent mismatch.`

				const account = await Account.findById(inflateId(payload._id))
				if(!isSysUser(account))
					return null
				
				const accounts = await Account.find(args)
				return accounts.map(gqlAccount)
			} catch(e){
				console.log(e)
				return null
			}
		}
	}
}