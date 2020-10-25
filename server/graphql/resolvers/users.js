const { User } = require('../../models');
const bcrypt = require('bcryptjs');
const { UserInputError, AuthenticationError } = require('apollo-server');
const jwt = require('jsonwebtoken');
const {JWT_SECRET} = require('../../config/env.json');
const { Op } = require('sequelize');

module.exports = {
    Query: {
        getUsers: async (_, __, { user }) => {
            try {
                if(!user) throw new AuthenticationError('Unauthenticated');
                
                const users = await User.findAll({
                    where: { username: { [Op.ne ]: user.username }}
                });

                return users;
            } catch (err) {
                console.log(err);
                throw err;
            }
        },
        me: async  (_, __, { user }) => {
            try {
                if(!user) throw new AuthenticationError('Unauthenticated');                
    
                return user;                
            } catch (err) {
                console.log(err)
                throw err;
            }
        },
        login: async (_, args) => {
            const { username, password } = args;
            let errors = {};

            try {
                if(username.trim() === '') errors.username = 'username must not be empty';
                if(password === '') errors.password = 'password must not be empty';

                if(Object.keys(errors).length > 0){
                    throw new UserInputError('bad input', { errors })
                }
                
                const user = await User.findOne({
                    where: { username }
                });

                if(!user){
                    errors.username = 'user not found';
                    throw new UserInputError('user not found', { errors })
                }

                const correctPassword = await bcrypt.compare(password, user.password);

                if(!correctPassword){
                    errors.password = 'password is incorrect';
                    throw new UserInputError('password is incorrect', { errors });
                }

                const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: 60 * 60 });

                return {
                    ...user.toJSON(),
                    createdAt: user.createdAt.toISOString(),
                    token,
                };
            } catch (err) {
                console.log(err);
                throw err;
            }
        }
    },
    Mutation: {
        register: async (_, args) => {

            let { username, email, password, confirmPassword } = args
            let errors = {};

            try{
                //validate data
                if(email.trim() === "") errors.email = 'email must not be empty';
                if(username.trim() === "") errors.username = 'username must not be empty';
                if(password.trim() === "") errors.password = 'password must not be empty';
                if(confirmPassword.trim() === "") errors.confirmPassword = 'confirm password must not be empty';
                if(confirmPassword !== password) errors.confirmPassword = 'confirm password must match password';

                //Check username/email exists
                // const userbyUsername = await User.findOne({ where: { username }});
                // const userbyEmail = await User.findOne({ where: { email }});
                
                // if(userbyUsername) errors.username = 'Username is taken';
                // if(userbyEmail) errors.email = 'email is taken';

                if(Object.keys(errors).length > 0){
                    throw errors;
                }

                // hash password
                password = await bcrypt.hash(password, 6);

                // Create user

                // return 
                const user = await User.create({
                    username, email, password
                })
                
                return user
            } catch(err) {
                console.log(err);
                if(err.name === 'SequelizeUniqueConstraintError'){
                    err.errors.forEach(
                        (e) => (errors[e.path] = `${e.path} is already taken`)
                    )
                } else if(err.name === 'SequelizeValidationError'){
                    err.errors.forEach((e) => (errors[e.path] = e.message))
                }
                throw new UserInputError('Bad input', { errors });
            }
        },
    }
};