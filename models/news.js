const mongoose = require('mongoose')

const newsSchema = new mongoose.Schema({
    name: String,
    link: String
})

newsSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete document._id
        delete document.__v
    }
})

module.exports = mongoose.model('News', newsSchema)