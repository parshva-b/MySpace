// require
require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const feedparser = require('ortoo-feedparser')

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
app.get('/', ( req, res ) => {
	res.render('index')
})

app.get('/news', (req, res) => {
	const url = 'https://news.google.com/rss?hl=en-US&gl=US&ceid=US%3Aen&x=1571747254.2933'

	feedparser.parseUrl(url).on('article', function( article ) {
		console.log('title:', article.title)
		// res.json(article)
	})
})

// app.get('/add', ( req, res ) => {
// 	res.render('add', { a: 10, b: 20 })
// })

// app.get('/table', (req, res) => {
// 	res.render('table', { persons: people })
// })

const PORT = process.env.PORT
app.listen( PORT, () => {
	console.log(`Server running on ${PORT}`)
})