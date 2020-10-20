const { User } = require('../models');
const bcrypt = require('bcryptjs');
const { UserInputError } = require('apollo-server');

module.exports = {
    Query: {
        getUsers: async () => {
            try {
                const users = await User.findAll();

                return users;
            } catch (error) {
                console.log(error)
            }
        },
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
        }
    }
};