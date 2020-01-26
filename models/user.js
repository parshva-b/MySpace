const mongoose = require('mongoose')

const config = require('../utils/config')

console.log(`Connecting to ${config.MONGODB}`)

mongoose.connect( config.MONGODB, { useNewUrlParser: true })
    .then( result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log(`Error connecting to MongoDB: ${error.message}`)
    })

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