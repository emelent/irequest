import {config} from 'dotenv'
import mongoose from 'mongoose'
import configureMongoose from '../src/mongoose.config'
import faker from 'faker'
import {Industry, Account, Question, Recruit, Company, Document} from '../src/models'
import {pickRandom, hashPassword} from '../src/utils'

// set up environment
const ENV = 'development'
process.env.BABEL_ENV = ENV
process.env.NODE_ENV = ENV

// load .env
config({path: `.env.${ENV}`})

const sysAccounts = [
	{email:"admin@gmail.com", password: hashPassword("admin"), access: 9},
]
const provinces = [
	'Gauteng', 
	'Limpopo', 
	'North West', 
	'Northern Cape',
	'Eastern Cape',
	'Western Cape',
	'Mpumalanga',
	'KwaZulu Natal',
	'That Other Province'
]
const mockRecruits = length => Array.apply(null, {length}).map(i => ({
	name: faker.name.firstName(),
	surname: faker.name.lastName(),
	dob: faker.date.between(new Date(1960), new Date(2000)),
	province: pickRandom(provinces),
	city: faker.address.city,
	gender: pickRandom(['male', 'female']),
	disability: pickRandom(['blind', 'none','none', 'none']),
	vid1_url: faker.image.food(),
	vid2_url: faker.image.animals(),
	phone: faker.phone.phoneNumber(),
	qa1: {
		response: faker.random.words()
	},
	qa2: {
		response: faker.random.words()
	}
}))

const mockAccounts = length => Array.apply(null, {length}).map(i => ({
	email: faker.internet.email(),
	password: 'asdf'	
}))

const mockCompanies = length => Array.apply(null, {length}).map(i => ({
	name: faker.company.companyName(),
	verified: pickRandom([true, false, false, false]),
	address: faker.address.streetAddress(),
	email: faker.internet.email(),
	telephone: faker.phone.phoneNumber(),
	logo_url: faker.image.image(),
	reg_num: faker.random.alphaNumeric(12),
	tax_num: faker.random.alphaNumeric(16),
	vat_num: faker.random.alphaNumeric(24),
	bee_level: faker.random.number()
}))

const mockQuestions = length => Array.apply(null, {length}).map(i => ({
	question: faker.lorem.sentence()
}))
const mockIndustries = length => Array.apply(null, {length}).map(i => ({
	name: faker.name.jobArea() + ' ' + faker.name.jobArea() + ' ' + faker.name.jobArea()
}))


async function  openDb(callback){
	try{
		console.log('Connecting to database.')
		configureMongoose(mongoose)
		console.log('Database connected.')
		callback(null, true)
	}catch(err){
		callback(err, false)
	}
}
async function closeDb(callback){
	try{
		console.log('Closing database connection.')
		mongoose.disconnect()
		console.log('Database connection closed.')
		callback(null,  true)
	}catch(err){
		callback(err, false)
	}
}

async function seed(){
	try{
		console.log('[*] Connecting to database.')
		configureMongoose(mongoose)
		console.log('[*] Database connected.')
		
		// clear collections
		console.log('[*] Clearing database.')
		await Account.remove()
		await Industry.remove()
		await Question.remove()
		await Recruit.remove()
		await Company.remove()
		await Document.remove()
		console.log('[*] Database cleared.')
		
		console.log('[*] Now seeding database.\n')
		
		// ======================
		// SEED THE DATA
		// ======================
		
		// seed industries
		let industries = await Industry.create(mockIndustries(20))
		console.log(`\t[+] ${industries.length} industries created.`)
	

		// seed questions
		const q_data = mockQuestions(30).map(q => ({
			question:  q.question,
			industry_id: pickRandom(industries)._id
		}))
		const questions = await Question.create(q_data)
		console.log(`\t[+] ${questions.length} questions created.`)
		

		// seed system accounts
		const accounts = await Account.create(sysAccounts)
		console.log(`\t[+] ${accounts.length} system accounts created.`)


		// seed company profiles and recruiter accounts
		const c_accounts = await Account.create(mockAccounts(10))
		console.log(`\t[+] ${c_accounts.length} recruiter accounts created.`)

		const c_data = mockCompanies(10).map((c, i) => ({
			...c,
			industry_id:pickRandom(industries)._id,
			accounts: {
				admin: c_accounts[i]._id,
				users: []
			}
		}))
		let cprofiles = await Company.create(c_data)

		// link company profiles to accounts
		for(let i=0; i < c_accounts.length; i++){
			let acc = c_accounts[i]
			acc.profile = {
				company: cprofiles[i]._id,
				recruit: null
			}
			await acc.save()
		}
		console.log(`\t[+] ${cprofiles.length} company profiles created.`)		


		// seed recruit profiles and recruit accounts
		const r_accounts = await Account.create(mockAccounts(100))
		console.log(`\t[+] ${r_accounts.length} recruit accounts created.`)
		
		const r_data = mockRecruits(100).map((r, i) => ({
			...r,
			industry_id: pickRandom(industries)._id,
			qa1:{
				question_id: pickRandom(questions)._id,
				response: r.response
			},
			qa2:{
				question_id: pickRandom(questions)._id,
				response: r.response
			}
		}))
		let rprofiles = await Recruit.create(r_data)

		// link recruit profiles to accounts
		for(let i=0; i < r_accounts.length; i++){
			let acc = r_accounts[i]
			acc.profile = {
				recruit: rprofiles[i]._id,
				company: null
			}
			await acc.save()
		}
		console.log(`\t[+] ${rprofiles.length} recruit profiles created.`)

		
		console.log(`\n[*] ${process.env.NODE_ENV.toString().toUpperCase()} database successfully seeded.`)
	}  catch(err){
		console.error(err)
	} finally{
		console.log('[*] Closing database connection.')
		mongoose.disconnect()
		console.log('[*] Database connection closed.')
	}
}


seed()