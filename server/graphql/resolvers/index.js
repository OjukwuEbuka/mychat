const messageResolvers = require('./messages');
const userResolvers = require('./users');

module.exports = {
    Message: {
        createdAt: (parent) => parent.createdAt.toISOString(),
    },
    User: {
        createdAt: (parent) => parent.createdAt.toISOString(),
    },
    Query: {
        ...messageResolvers.Query,
        ...userResolvers.Query,
    },
    Mutation: {
        ...messageResolvers.Mutation,
        ...userResolvers.Mutation,
    },
    Subscription: {
        ...messageResolvers.Subscription,
    }
};