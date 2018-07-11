import jwt from 'jsonwebtoken'
import fs from 'fs'
import hash from 'jshashes'

import {privKey, pubKey} from '../constants'
const {ObjectId} = require('mongoose').Types


const alg = new hash.SHA256
const tokenDuration = '2d'

//private and public key streams
let privateCert = null
let publicCert = null
const secret = `Don't say word...`

try {
	privateCert = fs.readFileSync(privKey)
	publicCert = fs.readFileSync(pubKey)
} catch (error) {}



/**
 * Creates a signed jwt token with the given payload and options
 * @param {Object} payload 	- Token payload.
 * @param {Object} options 	- Token options.
 *
 * @return {String}
 */
export const createToken = (payload, options) =>
	(!privateCert || !publicCert)?
		jwt.sign(payload, secret, options):
		jwt.sign(payload, privateCert, { algorithm: 'RS256'}, options)

/**
 * Validates the token, returns the decoded payload if the token is
 * valid or null if invalid.
 *
 * @param {String} token  	- Jwt token.
 * @param {Object} options 	- Validation options.
 *
 * @return {Object | null}
 */
export const validateToken = (token, options) =>
	(!privateCert || !publicCert)?
		jwt.verify(token, secret, options):
		jwt.verify(token, publicCert, options)

/**
 * Hash a password.
 * @param {String} password 	- Raw password to be hashed.
 */
export const hashPassword = password => alg.hex(password)

/**
 * Creates a mongoose ObjectId from hex string.
 * @param {String} id 	- 24 character hex string.
 *
 * @return ObjectId
 */
export const inflateId = id => ObjectId.createFromHexString(id)

/**
 * Checks if given value is a 24 character hex.
 * @param {String} val 	- Value to check.
 *
 * @return {bool}
 */
export const isHex24 = val => {
	const reg = new RegExp(/^[0-9a-f]{24}$/i)
	return reg.test(val)
}


/**
 * Creates a new json webt token with the expiray date set to the value
 * in the expiresIn constant.
 *
 * @param {String} _id 		- User Id string
 * @param {String} ua		- User agent string
 *
 * @return {Object}
 */
export const createApiToken = (_id, ua, expiresIn=tokenDuration) => createToken({_id, ua}, {expiresIn})

/**
 * Select a random value from an array.
 * @param {Array} arr - Array
 */
export const pickRandom = arr => arr[Math.floor(Math.random() * arr.length)]

/**
 * Convert a set into an array.
 * @param {*} s - Set
 */
export const setToArray = (s) => {
	const arr = []
	s.forEach(v => arr.push(v))
	return arr
}

/**
 * Get Bearer token from authorization header.
 * @param {*} req
 */
export const getToken = (req) => req.get('authorization').split(' ')[1]

/**
 * Return a json object on the response stream.
 * @param {Object} res - Response stream.
 * @param {Integer} code - HTTP status code.
 * @param {*} msg - Message object.
 */
export const jsonResponse = (res, code, msg) => res.status(code).json(msg)

export const isUser = ({access}) => access == 0
export const isSysUser = ({access}) => access > 5
export const  isSysAdmin = ({access}) => access == 9