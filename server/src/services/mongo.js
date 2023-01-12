const mongoose = require('mongoose')

const MONGO_URL = 'mongodb+srv://nasa-api:zvlYxtgSfDk1kLP1@nasaprojectudemy.angzcjz.mongodb.net/nasa_db?retryWrites=true&w=majority'


mongoose.connection.once('open', () => {
  console.log('MongoDB connection is ready')
})

mongoose.connection.on('error', (err) => {
  console.error(err)
})

async function mongoConnect() {
  await mongoose.connect(MONGO_URL)
}

async function mongoDisconnect() {
  await mongoose.disconnect()
}

module.exports = {
  mongoConnect,
  mongoDisconnect
}