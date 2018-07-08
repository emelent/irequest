import {config} from 'dotenv'

// set up environment
const ENV = 'production'
process.env.BABEL_ENV = ENV
process.env.NODE_ENV = ENV

// load .env
config({path: `.env.${ENV}`})

require('../src/index')
