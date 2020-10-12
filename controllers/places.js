const { v4: uuidv4 } = require('uuid');

const HttpError = require('../models/http-error')

let DUMMY_PLACES = [
  {
    id : 'p1',
    title : 'Empire State Building',
    description : 'One of the most famous wold scrapper in the world',
    location : {
        lat: 40.7481563,
        lng: 73.9856961,
    },
    adress : '20 W 34th St, New York, NY 10001',
    creator : 'u1'
  }
]

exports.getPlaceById = (req, res, next) => {
  const placeId = req.params.placeId;
  const place = DUMMY_PLACES.find(p => p.id === placeId)
  if(!place){
    return next(new HttpError("Can't find place for this id.", 404))
  }
  res.json({ place })
}

exports.getPlacesByUserId = (req, res) => {
  const userId = req.params.userId;
  const places = DUMMY_PLACES.filter(p => p.creator === userId)
  if(!places || places.length === 0){
    // if you use a synchronous code, you can use Throw
    // if you use an asynchronous code, you use next()
    throw new HttpError("Can't find places for this user.", 404)
  }
  res.json({ places })
}

exports.createPlace = (req, res, next) => {
  const { title, description, coordinates, address, creator } = req.body;
  const createdPlace = {
    id : uuidv4(),
    title,
    description,
    location : coordinates,
    address,
    creator
  }

  DUMMY_PLACES.push(createdPlace);
  res.status(201).json({place : createdPlace})
}

exports.updatePlace= (req, res, next) => {
  const { title, description } = req.body;
  const placeId = req.params.placeId

  const updatePlace = {...DUMMY_PLACES.find(p => p.id === placeId)};
  const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId)
  updatePlace.title = title;
  updatePlace.description = description;

  DUMMY_PLACES[placeIndex] = updatePlace;
  res.status(200).json(updatePlace)
}

exports.deletePlace= (req, res, next) => {
  const placeId = req.params.placeId
  DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId)
  res.status(200).json({ message : "Place deleted" })
}