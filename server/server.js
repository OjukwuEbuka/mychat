const { ApolloServer } = require('apollo-server');

const { sequelize } = require('./models');

const path = require('path');

// A map of functions which return data for the schema.
const resolvers = require('./graphql/resolvers');

// Types Declarations
const typeDefs = require('./graphql/typeDefs');
const contextMiddleware = require('./util/contextMiddleware');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: contextMiddleware,
});

// server.use('/pic', (req, res) =>{
//     res.send(path.join(__dirname__, '/storage/dp/car1.jpeg'));
// })

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`);
    // console.log(path.join(__dirname, '/storage/dp/car1.jpeg'));
    sequelize.authenticate()
        .then(() => console.log('Database connected!'))
        .catch((err) => console.log(err));
})