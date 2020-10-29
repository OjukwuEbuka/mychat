const { gql } = require('apollo-server');

module.exports = gql`
    type Query{
        getUsers: [User]!
        login(username:String!, password: String!): User!
        me: User!
        getMessages(from: String!): [Message]!
    }

    type User {
        username: String!
        email: String
        token: String
        createdAt: String!
        imageUrl: String
        latestMessage: Message
    }

    type Message {
        uuid: String!
        content: String!
        from: String!
        to: String!
        createdAt: String!
    }

    type Mutation {
        register(
            username: String!,
             email: String!, 
            password: String!, 
            confirmPassword: String!
        ): User!
        sendMessage(to:String! content:String!): Message!
    }

    type Subscription{
        newMessage: Message!
    }
`;