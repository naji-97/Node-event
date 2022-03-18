const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    
    avatar: {
        type: String,
        required: true
    },
    
   
})

userSchema.methods.hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10))
}

userSchema.methods.comparePasswords = (password, hash) => {
    return bcrypt.compareSync(password,hash)
}

let User = mongoose.model('User', userSchema, 'users')

module.exports = User