/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
require('dotenv').config()
const express = require('express')
const Movie = require('./models/movie')


const reqLogger = (req, res, next) => {
	console.log('Method:', req.method)
	console.log('Path:  ', req.path)
	console.log('Body:  ', req.body)
	console.log('---')
	next()
}
  
const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint' })
}
  
const errorHandler = (error, req, res, next) => {
	console.error(error.message)
  
	if (error.name === 'CastError') {
		return res.status(400).send({ error: 'malformatted id' })
	} else if (error.name === 'ValidationError') {
		return res.status(400).json({ error: error.message })
	} 
  
	next(error)
}

const app = express()
app.use(express.json())
app.use(reqLogger)


app.get('/', (req, res) => {
	res.send('<h1>First CRUD Task !</h1>')
})

app.get('/api/categories', (req,res, next) => {
	Movie.find({}).then(category => {
		if(category) {
			res.json(category)
		} else {
			res.status(404).end()
		}
	})
		.catch(error => next(error))
})

app.post('/api/categories', (req, res, next) => {
	const body = req.body
	const movie = new Movie({
		categories: body.categories.map(category => {
			return {
				id: category.id,
				name: category.name,
				movies: category.movies.map(movie => {
					return {
						id: movie.id,
						name: movie.name,
						description: movie.description,
						rate: movie.rate
					}
				})
			}
		})
	})

	movie.save().then(savedMovie => {
		res.json(savedMovie)
	})
		.catch(error => next(error))
})

app.get('/api/categories/:id', (req, res, next) => {    
	Movie.find({ 'categories': { id: Number(req.params.id) } }).then(category =>{
		res.json(category)
	})
	next()
})


app.get('/api/categories/movie/:id', (req, res) => {
	Movie.findById(req.params.categories.movies.id).then(movie => {
		res.json(movie)
	})
})

app.delete('/api/categories/:id', (req, res, next) => {
	Movie.findByIdAndDelete(req.params.categories.id).then(result => {
		res.status(204).end()
	})
		.catch(error => next(error))
})

app.delete('/api/categories/movie/:id', (req, res, next) => {
	Movie.findByIdAndDelete(req.params.categories.movies.id).then(result => {
		res.status(204).end()
	})
		.catch(error => next(error))
})

app.put('/api/categories/:id', (req, res, next) => {
	const body = req.body

	const categories = body.categories.map(category => {
		return {
			id: category.id,
			name: category.name,
			movies: category.movies.map(movie => {
				return {
					id: movie.id,
					name: movie.name,
					description: movie.description,
					rate: movie.rate
				}
			})
		}
	})

	Movie.findByIdAndUpdate(req.params.categories.id, categories)
		.then(updatedCategory => {
			res.json(updatedCategory)
		})
		.catch(error => next(error))
})

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`)
})