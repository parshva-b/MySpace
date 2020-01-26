const mySpaceRouter = require('express').Router()
const User = require('../models/user')

const feedparser = require('ortoo-feedparser')

mySpaceRouter.get('/', ( req, res, next) => {
	res.render('index')
})

mySpaceRouter.get('/news', (req, res, next) => {
	const url = 'https://news.google.com/rss?hl=en-US&gl=US&ceid=US%3Aen&x=1571747254.2933'

	feedparser.parseUrl(url).on('article', function( article ) {
		console.log('title:', article.title)
		// res.json(article)
	})
})

mySpaceRouter.get('/user', (req, res, next) => {
	User.find({})
		.then( users => {
			res.json(users)
		})
		.catch( error => next(error) )
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