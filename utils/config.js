require('dotenv').config()

let PORT = process.env.PORT
let MONGODB = process.env.MONGODB

module.exports = {
    PORT,
    MONGODB
}