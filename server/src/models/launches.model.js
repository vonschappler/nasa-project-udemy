const launches = require('./launches.schema')
const planets = require('./planets.schema')

const DEFAULT_FLIGHT_NUMBER = 100

const launch = {
  flightNumber: 100,
  mission: 'Keppler Exploration X',
  rocket: 'Explorer IS1',
  launchDate: new Date('December 27, 2030'),
  target: 'Kepler-442 b',
  customers: ['ZTM', 'NASA'],
  upcoming: true,
  success: true
}

saveLaunch(launch)

async function existsLaunch(launchId) {
  return await launches.findOne({
    flightNumber: launchId
  })
}

async function getLatestFlightNumber() {
  const latestLaunch = await launches.findOne()
    .sort('-flightNumber')

  if(!latestLaunch) {
    return DEFAULT_FLIGHT_NUMBER
  }
  
  return latestLaunch.flightNumber
}

async function getAllLaunches() {
  return await launches.find({}, {
    '_id': 0, '__v': 0
  })
}

async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target
  })

  if(!planet) {
    throw new Error('No matching planet found')
  }

  await launches.findOneAndUpdate({
    flightNumber: launch.flightNumber
  }, launch, {
    upsert: true
  })
}

async function addNewLaunch(launch) {
  const newFlightNumber = await getLatestFlightNumber() + 1
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ['ZTM', 'NASA'],
    flightNumber: newFlightNumber
  })
  
  await saveLaunch(newLaunch)
}

async function abortLaunch(launchId) {
  const aborted =  await launches.updateOne({
    flightNumber: launchId
  }, {
    upcoming: false,
    success: false
  })
  return aborted.modifiedCount === 1;
}

module.exports = {
  existsLaunch,
  getAllLaunches,
  addNewLaunch,
  abortLaunch
}