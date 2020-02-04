const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    news: {
        type: [String],
        default: []
    },
    sports: {
        type: [String],
        default: [] 
    }
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete document._id
        delete document.__v
    }
})

module.exports = mongoose.model('User', userSchema)