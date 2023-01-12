const request = require('supertest')
const  app = require('../../app')
const { loadPlanetsData } = require('../../models/planets.model')
const {mongoConnect, mongoDisconnect} = require('../../services/mongo')
const version = 'v1'
const {loadPlanetsData} = require('../../models/planets.model')

describe('Launches API', () => {
  beforeAll(async ()=> {
    await mongoConnect()
    await loadPlanetsData()
  })

  describe('Test GET /launches', () => {
    test('It should respond with 200 success', async () => {
      const response = await request(app)
        .get(`/${version}/launches`)
        .expect('Content-Type', /json/)
        .expect(200)
    })
  })

  describe('Test POST /launches', () => {
    const completeLaunchData = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-62 f',
      launchDate: 'January 4, 2028'
    }

    const launchDataWithoutDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-62 f',
    }

    const launchDataWithInvalidDate = {
      mission: 'USS Enterprise',
      rocket: 'NCC 1701-D',
      target: 'Kepler-62 f',
      launchDate: 'hello'
    }

    test('It should respond with 201 created', async () => {
      const response = await request(app)
        .post(`/${version}/launches`)
        .send(completeLaunchData)
        .expect('Content-Type', /json/)
        .expect(201)

      const requestDate = new Date(completeLaunchData.launchDate.valueOf())
      const responseDate = new Date(response.body.launchDate.valueOf())
      expect(responseDate).toMatchObject(requestDate)
    })
    
    test('It should catch missing required properties', async () => {
      const response = await request(app)
        .post(`/${version}/launches`)
        .send(launchDataWithoutDate)
        .expect('Content-Type', /json/)
        .expect(400)
      expect(response.body).toStrictEqual({
        error: "Cannot create a launch when missing required data. Please check all the required information were provided."
      })
    })
    
    test('It should catch invalid dates', async () => {
      const response = await request(app)
        .post(`/${version}/launches`)
        .send(launchDataWithInvalidDate)
        .expect('Content-Type', /json/)
        .expect(400)
      expect(response.body).toStrictEqual({
        error: "Invalid launch date"
      })
    })
  })

  afterAll(async () => {
    await mongoDisconnect()
  })
})

