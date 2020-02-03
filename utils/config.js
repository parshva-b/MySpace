require('dotenv').config()

let PORT = process.env.PORT
let MONGODB = process.env.MONGODB
let token = process.env.token

module.exports = {
    PORT,
    MONGODB,
    token
}