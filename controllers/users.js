const bodyParser = require('body-parser')
const axios = require('axios')
const config = require('../utils/config')
const mySpaceRouter = require('express').Router()

const User = require('../models/user')
const News = require('../models/news') 
const Parser = require('rss-parser')
const parser = new Parser()

let token = config.token || {}
console.log('token:', token)

const jsonParser = bodyParser.json()

mySpaceRouter.get('/', (req, res, next) => {
	if(Object.entries(token).length === 0 && token.constructor === Object) {
		res.redirect('/login')
	}
	else {
		res.render('index')
	}
})

mySpaceRouter.get('/register', (req, res, next) => {
	res.render('register')
})

mySpaceRouter.get('/login', (req, res, next) => {
	res.render('login')
})

mySpaceRouter.get('/all', async (req, res, next) => {
	let result = []
	const news = await News.find({})
	result = [ ...result, ...news ]
	res.json(result)
})

mySpaceRouter.get('/news',async (req, res, next) => {
	if( Object.entries(token).length === 0 && token.constructor === Object ) {
		res.status(401).json({
			error: 'Bad request, User must be authenticated'
		})
	}
	else {
		const rss = token.news
		// const rss = ['https://reddit.com/r/worldnews/.rss', 'https://news.google.com/rss?hl=en-US&gl=US&ceid=US%3Aen&x=1571747254.2933']
		let result = []
		for(let i = 0; i < rss.length; i++) {
			let urls = []
			const feed = await parser.parseURL(rss[i])
			for(let i = 0; i < 10; i++) {
				urls = [...urls, feed.items[i]]
			}
			console.log('urls', urls.length)
			urls.map( item => {
				const content = {
					title: item.title,
					link: item.link
				}
				result = [ ...result, content]
			})
		}
		console.log('result', result.length)
		res.render('news', { articles: result })
		console.log('-----------------------------')
	}
})

mySpaceRouter.get('/sports', async (req, res, next) => {
	const result = await axios.get(`https://cricapi.com/api/matches?apikey=${config.API_KEY}`)
	const matches = result.data.matches.map(m => {
		return {
			team1: m['team-1'],
			team2: m['team-2'],
			winner: m.winner_team
		}
	})
	// res.json(matches)
	// console.log(matches)
	res.render('match', { matches: matches })
})

mySpaceRouter.get('/user', (req, res, next) => {
	console.log(token)
	User.findOne({ username: token.username })
		.then( users => {
			res.json(users)
		})
		.catch( error => next(error) )
})

mySpaceRouter.get('/profile', async (req, res, next) => {
	if( Object.entries(token).length === 0 && token.constructor === Object ) {
		res.status(401).json({
			error: 'Bad request, User must be authenticated'
		})
	}
	else {
		let answer = []
		const news = await News.find({})
		answer = news.filter(n => !token.news.includes(n.link) )
		res.render('profile', { news: answer })
	}
})

mySpaceRouter.post('/user/news', (req, res, next) => {
	if( Object.entries(token).length === 0 && token.constructor === Object ) {
		res.status(401).json({
			error: 'Bad request, User must be authenticated'
		})
	}
	else {
		const user = token
		const body = req.body
		console.log(body)
		// if( !user.news.includes( body.news ) ) {
		// 	user.news = [ ...user.news, body.news]
		// 	User.findByIdAndUpdate( token._id, user, { new: true })
		// 	.then( updatedUser => {
		// 		res.json(updatedUser.toJSON())
		// 	})
		// 	.catch(error => next(error))
		// }
		// // console.log(user)
		// else {
		// 	res.status(204)
		// }
		// console.log(user)
	}
})

mySpaceRouter.post('/login', jsonParser, (req, res, next) => {
	const body = req.body
	console.log(body.username, body.password)
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

mySpaceRouter.post('/register', async (req, res, next) => {
	const body = req.body
	console.log(body)
	if( body === undefined ) {
		return res.status(400).json({
			error: 'Bad request'
		})
	}

	const user = new User({
		username: body.username,
		password: body.password
	})
	token = user

	await user.save()
	res.redirect('/')
})

mySpaceRouter.post('/logout', (req, res, next) => {
	token = {}
	res.redirect('/')
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