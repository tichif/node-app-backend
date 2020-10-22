const axios = require('axios');

const HttpError = require('../models/http-error');

const API_KEY = 'AIzaSyCQWFn8d57k1V8l2eJNRb5WFMrW9XII0SM';

async function getCoordsForAddress(address) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );

  const data = response.data;
  if (!data || data.status === 'ZERO_RESULTS') {
    const error = new HttpError('Could not found location', 404);
    throw error;
  }

  const coordinates = data.results[0].geometry.location;

  return coordinates;
}

module.exports = getCoordsForAddress;
