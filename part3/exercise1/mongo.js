const mongoose = require('mongoose')
console.log('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
console.log('password', password)

const url =
  `mongodb+srv://mehmetyagci53:${password}@mycluster.nqz1ts5.mongodb.net/noteApp?retryWrites=true&w=majority`
console.log('url', url)

mongoose.set('strictQuery', false)
mongoose.connect(url).then(() => {
  console.log('connected to MongoDB')
  const noteSchema = new mongoose.Schema({
    content: String,
    important: Boolean,
  })

  const Note = mongoose.model('Note', noteSchema)

  const note = new Note({
    content: 'HTML is x',
    important: true,
  })

  console.log(note)

  /*
  note.save().then(result => {
    console.log('note saved!')
    mongoose.connection.close()
  })
  */
  Note.find({}).then(result => {
    console.log('notes:')
    result.forEach(note => {
      console.log(note)
    })
    mongoose.connection.close()
  })
})