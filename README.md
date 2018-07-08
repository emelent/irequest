# OctoPalm GraphQL API
## Graphql backend for octopalm client web app.


### Up and running:

    npm install
	npm run prep

#### Get Mongo running
	mongod --dbpath="./data"
	npm run seed

#### Start that server
	npm start

 And you're good to go. The graphql api should be up and
 running and available through your browser at http://localhost:5000/graphiql and via curl or other clients at http://localhost:5000/graphql.

### Issues:

- Mutation response in update requests is always of the previous model state


### To Do:
- Secure certain routes
- Test the graphql resolvers
- Add last-modified necessary modules

