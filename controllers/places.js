const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/places');

let DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building',
    description: 'One of the most famous wold scrapper in the world',
    location: {
      lat: 40.7481563,
      lng: 73.9856961,
    },
    adress: '20 W 34th St, New York, NY 10001',
    creator: 'u1',
  },
];

exports.getPlaceById = async (req, res, next) => {
  const placeId = req.params.placeId;

  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not found a place',
      500
    );
    return next(error);
  }
  if (!place) {
    const error = new HttpError("Can't find place for this id.", 404);
    return next(error);
  }
  // Convert the mongoose object to a Javascript object with the method .toObject
  // turn _id to id by passing as argument {getters : true}
  res.json({ place: place.toObject({ getters: true }) });
};

exports.getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.userId;

  let places;

  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not found places',
      500
    );
    return next(error);
  }

  if (!places || places.length === 0) {
    // if you use a synchronous code, you can use Throw
    // if you use an asynchronous code, you use next()
    return next(new HttpError("Can't find places for this user.", 404));
  }
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

exports.createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // in async, throw will not work
    return next(
      new HttpError('Invalid inputs, passed, please checked your data', 422)
    );
  }

  const { title, description, address, creator } = req.body;

  let coordinates;
  try {
    coordinates = await getCoordsForAddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/1/10/Empire_State_Building_%28aerial_view%29.jpg',
    creator,
  });

  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }
  res.status(201).json({ place: createdPlace });
};

exports.updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError(
      'Invalid inputs, passed, please checked your data',
      422
    );
  }

  const { title, description } = req.body;
  const placeId = req.params.placeId;

  let place;

  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError('Something went wrong !!!');
    return next(error);
  }

  place.title = title;
  place.description = description;

  try {
    await place.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong !!! Cannot update the place',
      500
    );
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};

exports.deletePlace = async (req, res, next) => {
  const placeId = req.params.placeId;
  let place;

  try {
    place = await Place.findByIdAndRemove(placeId);
  } catch (err) {
    const error = new HttpError('Something went wrong !!!', 500);
    return next(error);
  }

  res.status(200).json({ message: 'Place deleted' });
};
