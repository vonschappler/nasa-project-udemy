const express = require('express')

const planetsRouter = require('./planets/planets.router')
const launchesRouter = require('./launches/launches.router')

const v1Route = express.Router()


v1Route.use('/planets', planetsRouter)
v1Route.use('/launches', launchesRouter)

module.exports = v1Route