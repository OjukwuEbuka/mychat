const { gql } = require('apollo-server');

module.exports = gql`
    type Query{
        getUsers: [User]!
    }

    type User {
        username: String!
        email: String!
    }
`;