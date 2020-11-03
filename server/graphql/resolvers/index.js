const messageResolvers = require('./messages');
const userResolvers = require('./users');

const { User, Message } = require('../../models')

module.exports = {
    Message: {
        createdAt: (parent) => parent.createdAt.toISOString(),
    },
    Reaction: {
        createdAt: (parent) => parent.createdAt.toISOString(),
        message: async (parent) => await Message.findByPk(parent.messageId),
        user: async (parent) => await User.findByPk(parent.userId, { attributes: ['createdAt', 'username', 'imageUrl']})
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