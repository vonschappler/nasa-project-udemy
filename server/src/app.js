const express = require('express')
const morgan = require('morgan')
const path = require('path')
const cors = require('cors')

const app = express()

const v1Router = require('./routes/v1')

app.use(cors({
  origin: 'http://localhost:3000'
}))
app.use(morgan('combined'))

app.use(express.json())
app.use(express.static(path.join(__dirname, '..', 'public')))

app.use('/v1', v1Router)
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'))
})

module.exports = app