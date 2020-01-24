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

const people = [
    {
        id: 1,
        name: 'Parshva'
    },
    {
        id: 2,
        name: 'Sakina'
    }
]

// routers
app.get('/', ( req, res ) => {
    res.render('index')
})

app.get('/add', ( req, res ) => {
    res.render('add', { a: 10, b: 20 })
})

app.get('/table', (req, res) => {
    res.render('table', { persons: people })
})

const PORT = process.env.PORT
app.listen( PORT, () => {
    console.log(`Server running on ${PORT}`)
})