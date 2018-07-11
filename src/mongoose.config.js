export default function(mongoose){
	//set mongoose to return standard Javascript Promises instead of Mongoose promises
	//so we can use await/async stuff.
	mongoose.Promise =  global.Promise
	// connect database
	mongoose.connect(process.env.DB_URL)
}