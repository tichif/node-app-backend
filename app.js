const express = require('express')
const bodyParser = require('body-parser')

const HttpError = require('./models/http-error')
const placesRoutes = require('./routes/places')

const app = express()


app.use(bodyParser.json())

app.use('/api/places',placesRoutes)

// Implement unsupported routes error
app.use((req, res, next) => {
  const error = new HttpError("Could not found this route", 404)
  throw error
})

// Error handling middleware
app.use((error,req, res, next) => {
  if(res.headerSent){
    return next(error)
  }
  res.status(error.code || 500)
  .json({ message : error.message || 'An unknown error occurred !!!'})
})

app.listen(5000, () => {
  console.log("App is running");
})