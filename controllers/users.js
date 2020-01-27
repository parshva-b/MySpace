const mySpaceRouter = require('express').Router()
const User = require('../models/user')
const feedparser = require('ortoo-feedparser')

let token = {}

mySpaceRouter.get('/', ( req, res, next) => {
	if(Object.entries(token).length === 0 && token.constructor === Object) {
		res.json({
			message: 'Login kara'
		})
	}
	else {
		res.render('index')
	}
})

mySpaceRouter.get('/news', (req, res, next) => {
	const url = 'https://news.google.com/rss?hl=en-US&gl=US&ceid=US%3Aen&x=1571747254.2933'

	feedparser.parseUrl(url).on('article', function( article ) {
		console.log('title:', article.title)
		// res.json(article)
	})
})

mySpaceRouter.get('/user', (req, res, next) => {
	console.log(token)
	User.findOne({ username: token.username })
		.then( users => {
			res.json(users)
		})
		.catch( error => next(error) )
})

mySpaceRouter.post('/login', (req, res, next) => {
	const body = req.body
	User.findOne({ username: body.username })
		.then( user => {
			// if login successful
			if( user.password === body.password ) {
				token = user
				res.redirect('/')
			}
			else {
				// if login fails
				res.json({
					error: 'Invalid credentials'
				})
			}
		})
		.catch(error => next(error))
})

// const people = [
// 	{
// 		id: 1,
// 		name: 'Parshva'
// 	},
// 	{
// 		id: 2,
// 		name: 'Sakina'
// 	}
// ]

module.exports = mySpaceRouter