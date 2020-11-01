const { User, Message, Reaction } = require('../../models');
const { 
    UserInputError, 
    AuthenticationError, 
    withFilter, 
    ForbiddenError 
} = require('apollo-server');
const { Op } = require('sequelize');

module.exports = {
    Query: {
        getMessages: async (parent, { from }, { user }) => {
            try {
                if(!user) throw new AuthenticationError('Unauthenticated');
                const correspo = await User.findOne({ where: { username: from }});
                if(!correspo) throw new UserInputError('User not found!');

                const usernames = [user.username, correspo.username]
                const messages = await Message.findAll({ 
                    where: { 
                        from: {[Op.in]: usernames},
                        to: {[Op.in]: usernames},
                     },
                    order: [['createdAt', 'DESC']],
                });

                return messages;
            } catch (err) {
                console.log(err)
                throw err;
            }

        }
    },
    Mutation: {
        sendMessage: async (parent, { to, content }, { user, pubsub }) => {
            try {
                if(!user) throw new AuthenticationError('Unauthenticated');
                
                const recipient = await User.findOne({ where: { username: to }});
                console.log(recipient);
                if(!recipient){
                    throw new UserInputError('User not found');
                } else if (recipient.username === user.username){
                    throw new UserInputError('You cant message yourself');
                }

                if(content.trim() === ''){
                    throw new UserInputError('Message is empty');
                }

                const message = await Message.create({
                    from: user.username,
                    to,
                    content
                });

                pubsub.publish('NEW_MESSAGE', { newMessage: message })
                
                return message;
            } catch (err) {
                console.log(err)
                throw err;
            }
        },
        reactToMessage: async (_, {uuid, content }, { user }) => {
            const reactions = ['❤️', '😆', '😯', '😢', '😡', '👍', '👎'];
            try {
                if(!reactions.includes(content)){
                    throw new UserInputError('Invalid reaction');
                }

                // Get User
                const username = user ? user.username : '';
                user = await User.findOne({ where: { username }});
                if(!user) throw new AuthenticationError('Unauthenticated');

                // Get Message
                const message = await Message.findOne({ where: { uuid }});
                if(!message) throw new UserInputError('Message not found');

                if(message.from !== user.username && message.to !== user.username){
                    throw new ForbiddenError('Unauthorized');
                }

                let reaction = await Reaction.findOne({
                    where: { messageId: message.id, userId: user.id }
                })

                if(reaction){
                    // Update existing reaction
                    reaction.content = content;
                    await reaction.save();
                } else {
                    // create new reaction
                    reaction = await Reaction.create({
                        messageId: message.id,
                        userId: user.id,
                        content
                    })
                }

                return reaction;
            } catch (err) {
                throw err;
            }
        },
    },
    Subscription: {
        newMessage: {
            subscribe: withFilter((_, __, { pubsub, user }) => { 
                if(!user) throw new AuthenticationError('Unauthenticated');
                return pubsub.asyncIterator(['NEW_MESSAGE'])
            }, ({ newMessage }, _, { user }) => {
                if(newMessage.from === user.username || newMessage.to === user.username){
                    return true;
                }
                return false;
            })
        },
    }
};