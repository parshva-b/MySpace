require('dotenv').config()

let PORT = process.env.PORT
let MONGODB = process.env.MONGODB
let token = process.env.token
let API_KEY = process.env.API_KEY

module.exports = {
    PORT,
    MONGODB,
    token,
    API_KEY
}