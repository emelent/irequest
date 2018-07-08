import mongoose from 'mongoose'

import configureMongoose from './mongoose.config'
import app from './routers'

configureMongoose(mongoose)

const port = parseInt(process.env.PORT, 10) || 5000
const host = process.env.HOST || '0.0.0.0'

// start listening
app.listen(port, host, () => {
	console.log(`Listening on ${host}:${port}`)
})
