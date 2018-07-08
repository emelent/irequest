import {config} from 'dotenv'

// set up environment
config({path: `.env.${process.env.NODE_ENV}`})