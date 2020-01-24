// require
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')

// use
app.set('view engine', 'ejs')
app.use(cors())
app.use(bodyParser.json())

// routers
app.get('/', ( req, res ) => {
    res.render('index')
})

const PORT = process.env.PORT
app.listen( PORT, () => {
    console.log(`Server running on ${PORT}`)
})