/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('Connecting to', url)

mongoose.connect(url)
	.then(result => {
		console.log('Connected to MongoDB')
	})
	.catch((error) => {
		console.log('Error connecting to MognoDB')
	})

const movieScehma = new mongoose.Schema({
	categories: [
		{
			id: Number,
			name: String,
			movies: [
				{
					id: Number,
					name: String,
					description: String,
					rate: Number
				}
			]
		}
	]
})

movieScehma.set('toJSON', {
	transform: (document, returnedObject) => {
		returnedObject.id = returnedObject._id.toString()
		delete returnedObject._id
		delete returnedObject.__v
	}
})

module.exports = mongoose.model('Movie', movieScehma)