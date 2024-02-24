const express = require('express')
const app = express()
require('dotenv').config()

const Note = require('./models/note')

let notes = [
]

app.use(express.static('dist'))

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const cors = require('cors')

app.use(cors())

app.use(express.json())
app.use(requestLogger)

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.get('/', (request, response) => {
  console.log('index.js -> GET /')
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) => {
  console.log('index.js -> GET /api/notes')
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.post('/api/notes', (request, response) => {
  console.log('index.js -> POST /api/notes')
  const body = request.body

  if (body.content === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

app.get('/api/notes/:id', (request, response) => {
  console.log('index.js -> GET /api/notes/:id', request.params.id)
  Note.findById(request.params.id).then(note => {
    response.json(note)
  })
})

app.delete('/api/notes/:id', (request, response) => {
  console.log('index.js -> DELETE /api/notes/:id', request.params.id)
  const id = Number(request.params.id)
  notes = notes.filter(note => note.id !== id)

  response.status(204).end()
})

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})