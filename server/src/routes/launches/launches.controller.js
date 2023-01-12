const {
  getAllLaunches,
  addNewLaunch,
  existsLaunch,
  abortLaunch,
} = require('../../models/launches.model')

const {getPagination} = require('../../services/query')

async function httpGetLaunches(req, res) {
  const {skip, limit} =  getPagination(req.query)
  const launches = await getAllLaunches(skip, limit)
  return res.status(200)
    .json(launches)
}

async function httpSubmitLaunch(req, res) {
  const launch = req.body
  
  if(!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
    return res.status(400)
    .json({
      error: "Cannot create a launch when missing required data. Please check all the required information were provided."
    })
  }
  
  launch.launchDate = new Date(launch.launchDate)
  if (isNaN(launch.launchDate)) {
    return res.status(400)
      .json({
        error: "Invalid launch date"
      })
  }
  await addNewLaunch(launch)
  return res.status(201)
    .json(launch)
}

async function httpAbortLaunch(req, res) {
  const launchId = Number(req.params.id)
  const existLaunch = await existsLaunch(launchId)
  if (!existLaunch) {
    return res.status(404)
      .json({
        error: "Launch not found..."
      })
  }
  const aborted = await abortLaunch(launchId)
  console.log(aborted)
  if (!aborted) {
    return res.status(400)
      .json({
        error: 'Launch not aborted'
      })
  }
  
  return res.status(200)
    .json({
      ok: true
    })
}

module.exports = {
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch
}