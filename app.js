const config = require('./utils/config')
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
const mySpaceRouter = require('./controllers/users')
const middleware = require('./utils/middleware')
const mongoose = require('mongoose')

mongoose.connect( config.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
	.then(result => {
		console.log('Connected to MongoDB')
	})
	.catch(error => {
		console.log(`Error while connecting to ${error.message}`)
	})


app.set('view engine', 'ejs')
app.use(cors())
app.use(bodyParser.json())
morgan.token('body', function(res, req) { return JSON.stringify( req.body ) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use('', mySpaceRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app