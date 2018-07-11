import {config} from 'dotenv'
import mongoose from 'mongoose'
import configureMongoose from '../src/mongoose.config'
import {Industry, Account, Question} from '../src/models'
import {hashPassword} from '../src/utils'

// set up environment
const ENV = 'development'
process.env.BABEL_ENV = ENV
process.env.NODE_ENV = ENV

// load .env
config({path: `.env.${ENV}`})

// seed data
const data = {
	industry: [
		{name: "Digital Design"},
		{name: "Software Development"},
		{name: "Mining Industry"},
		{name: "Scissor Industry"}
	],
	question: [
		{question: "What's this?"},
		{question: "How big is an elephant?"},
		{question: "Where's the coffee machine?"},
		{question: "Bear versus pizza, who wins?"},	
		{question: "How many screws does it take to hold a lightbulb?"},	
	],
	account: [
		{email:"admin@gmail.com", password: hashPassword("admin"), access: 9}
	]
}
async function seed(){
	try {
		console.log('Opening db connection.')
		configureMongoose(mongoose)

		await Account.remove()
		await Industry.remove()
		await Question.remove()
		
		await data.industry.map(async i => {
			await new Industry(i).save()
		})
		console.log('Industries seeded.')
		

		await data.account.map(async a => {
			await new Account(a).save()
		})
		console.log('Accounts seeded.')

	} catch (e){
		console.log(e)
		throw e
	}
	finally {
		setTimeout(() => {
			console.log('Closing db connection.')
			mongoose.disconnect()
		},3000)

	}
}

seed().then(() => console.log(`[${process.env.NODE_ENV.toString()} database seeded.]`))
	.catch(err => console.log(`Seeding failed: ${err}`))

