import test from 'tape'
import request from 'supertest'
import mongoose from 'mongoose'

import app from '../../src/routers'
import configureMongoose from '../../src/mongoose.config'
import {User} from '../../src/models'
import {createApiToken} from '../../src/utils'


// login consts
const goodLogin = {
	student_id: '12345678',
	password: 'password'
}
const badPasswordLogin = {
	student_id: '12345678',
	password: 'wrong password'
}
const badStudentIdLogin = {
	student_id: '1234567',
	password: 'password'
}
const noPasswordLogin = {
	student_id: '12345678'
}
const noStudentIdLogin = {
	password: 'password'
}

// register consts
const goodRegister = {
	name: 'Goody',
	student_id: '11111111',
	password: 'password'
}
const duplicateRegister = {
	name: 'Dupe',
	student_id: '12345678',
	password: 'password'
}
const noPasswordRegister = {
	name: 'noPass',
	student_id: '87654321'
}
const noStudentIdRegister = {
	name: 'NoStud',
	password: 'password'
}
const noNameRegister = {
	student_id: '22345672',
	password: 'password'
}

const contentJson = ['Content-Type',  /json/]
const msgBadLogin = 'Login unsuccessful.'
const msgBadRegister = 'Registration unsuccessful.'
const msgBadRefresh = 'Token refresh unsuccessful.'

const testPost = path => (t, body, status, msg, headers={}) => {
	configureMongoose(mongoose)
	request(app)
		.post(path)
		.set(headers)
		.send(body)
		.expect(status)
		.expect(...contentJson)
		.end(err => {
			t.error(err, msg)
			mongoose.disconnect()
			t.end()
		})
}
	
// /auth/login SPEC
const testLogin = testPost('/auth/login')
test('A user tries to login with the right credentials', t => {
	testLogin(t, goodLogin, 200, 'Login successful.')
})

test('A user tries to login with an incorrect password', t => {
	testLogin(t, badPasswordLogin, 403, msgBadLogin)
})

test('A user tries to login with an incorrect student_id', t => {
	testLogin(t, badStudentIdLogin, 403, msgBadLogin)
})

test('A user tries to login without a student_id', t => {
	testLogin(t, noStudentIdLogin, 422, msgBadLogin)
})

test('A user tries to login without a password', t => {
	testLogin(t, noPasswordLogin, 422, msgBadLogin)
})

// /auth/register SPEC
const testRegister = testPost('/auth/register')
test('A new user tries to register with valid details', t => {
	testRegister(t, goodRegister, 201, 'Registration successful.')
})
test('A new user tries to register without a password', t => {
	testRegister(t, noPasswordRegister, 422, msgBadRegister)
})
test('A new user tries to register without a student_id', t => {
	testRegister(t, noStudentIdRegister, 422, msgBadRegister)
})
test('A new user tries to register without a student_id', t => {
	testRegister(t, noNameRegister, 422, msgBadRegister)
})
test('A new user tries to register with a used student_id', t => {
	testRegister(t, duplicateRegister, 401, msgBadRegister)
})

// /auth/refresh SPEC
test('A user tries refresh a valid token.', async(t) => {
	configureMongoose(mongoose)
	const user = await User.findOne()
	const ua = 'Mozilla'
	const token = createApiToken(user._id.toString(), ua)
	const headers = {
		authorization:  `Bearer ${token}`,
		'user-agent': ua
	}
	request(app)
		.post('/auth/refresh')
		.set(headers)
		.expect(200)
		.expect(...contentJson)
		.end(err => {
			t.error(err, 'Token refresh successful.')
			mongoose.disconnect()
			t.end()
		})
})
test('A user tries to refresh a valid token from different user-agent.', async(t) => {
	configureMongoose(mongoose)
	const user = await User.findOne()
	const ua = 'Mozilla'
	const token = createApiToken(user._id.toString(), ua)
	const headers = {authorization:  `Bearer ${token}`}
	request(app)
		.post('/auth/refresh')
		.set(headers)
		.expect(403)
		.expect(...contentJson)
		.end(err => {
			t.error(err, msgBadRefresh)
			mongoose.disconnect()
			t.end()
		})
})
test('A user tries to refresh an invalid token', t => {
	testPost('/auth/refresh')(t, null, 403, msgBadRefresh, {
		authorization: 'I made this up'
	})
})