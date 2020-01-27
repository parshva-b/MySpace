const mySpaceRouter = require('express').Router()
const User = require('../models/user')
const Parser = require('rss-parser')
const parser = new Parser()

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

mySpaceRouter.get('/news',async (req, res, next) => {
	if( Object.entries(token).length === 0 && token.constructor === Object ) {
		res.status(401).json({
			error: 'Bad request, User must be authenticated'
		})
	}
	else {
		const rss = token.news
		let result = []
		for( const x of rss ) {
			console.log(x)
			await parser.parseURL(x, (error, feed) => {
				for( let i = 1; i <= 10; i++ ) {
					const item = feed.items[i]
					console.log(item.title)
					const content = {
						title: item.title,
						url: item.link
					}
					result = [ ...result, content ]
				}
			})
		}
		res.json(result)
		console.log('-----------------------------')
	}
})

mySpaceRouter.get('/user', (req, res, next) => {
	// console.log(token)
	User.findOne({ username: token.username })
		.then( users => {
			res.json(users)
		})
		.catch( error => next(error) )
})

mySpaceRouter.put('/user/news', (req, res, next) => {
	if( Object.entries(token).length === 0 && token.constructor === Object ) {
		res.status(401).json({
			error: 'Bad request, User must be authenticated'
		})
	}
	else {
		const user = token
		const body = req.body
		if( !user.news.includes( body.news ) ) {
			user.news = [ ...user.news, body.news]
			User.findByIdAndUpdate( token._id, user, { new: true })
			.then( updatedUser => {
				res.json(updatedUser.toJSON())
			})
			.catch(error => next(error))
		}
		// console.log(user)
		else {
			res.status(204)
		}
	}
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