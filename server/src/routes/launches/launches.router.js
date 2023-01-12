const express = require('express')
const {
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch
} = require('./launches.controller')

const launchesRouter = express.Router()

launchesRouter.get('/', httpGetLaunches)
launchesRouter.post('/', httpSubmitLaunch)
launchesRouter.delete('/:id', httpAbortLaunch)

module.exports = launchesRouter