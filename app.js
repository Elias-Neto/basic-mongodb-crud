require('dotenv').config()
const express = require('express')
const { ObjectId } = require('mongodb')

const app = express()
app.use(express.json())

const { initDatabase } = require('./db')

const port = process.env.APP_PORT || 3000

let collection
initDatabase().then(books => {
  collection = books
})

// Create a new book
app.post('/books', async (req, res) => {
  const book = req.body
  await collection.insertOne(book)
  res.status(201).send(book)
})

// Get all books
app.get('/books', async (req, res) => {
  const books = await collection.find().toArray()
  books.length > 0 ? res.send(books) : res.status(404).json({ message: 'No books found' })
})

// Get a single book
app.get('/books/:id', async (req, res) => {
  const book = await collection.findOne({ _id: new ObjectId(req.params.id) })
  book ? res.send(book) : res.status(404).json({ message: 'Book not found' })
})

// Update a book
app.put('/books/:id', async (req, res) => {
  await collection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body })
  res.status(200).send(req.body)
})

// Delete a book
app.delete('/books/:id', (req, res) => {
  collection.deleteOne({ _id: new ObjectId(req.params.id) })
  res.status(204)
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})