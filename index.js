// require
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const feedparser = require('ortoo-feedparser')

const User = require('./models/user')
const config = require('./utils/config')

// use
app.set('view engine', 'ejs')
app.use(cors())
app.use(bodyParser.json())
morgan.token('body', function(res, req) { return JSON.stringify( req.body ) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

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
app.get('/', ( req, res, next) => {
	res.render('index')
})

app.get('/news', (req, res, next) => {
	const url = 'https://news.google.com/rss?hl=en-US&gl=US&ceid=US%3Aen&x=1571747254.2933'

	feedparser.parseUrl(url).on('article', function( article ) {
		console.log('title:', article.title)
		// res.json(article)
	})
})

app.get('/user', (req, res, next) => {
	User.find({})
		.then( users => {
			res.json(users)
		})
})

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = ( error, request, response, next ) => {
	console.log(error)

	if( error.name === 'CastError' && error.kind === 'ObjectId' ) {
		return response.status(400).send({
			error: 'Malformatted id: Resend request'
		})
	}

	next(error)
}

app.use(errorHandler)

// app.get('/add', ( req, res ) => {
// 	res.render('add', { a: 10, b: 20 })
// })

// app.get('/table', (req, res) => {
// 	res.render('table', { persons: people })
// })

app.listen( config.PORT, () => {
	console.log(`Server running on ${config.PORT}`)
})