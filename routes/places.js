const express = require('express')

const HttpError = require('../models/http-error')

const router = express.Router();

const DUMMY_PLACES = [
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

router.get('/user/:userId', (req, res) => {
  const userId = req.params.userId;
  const place = DUMMY_PLACES.find(p => p.creator === userId)
  if(!place){
    // if you use a synchronous code, you can use Throw
    // if you use an asynchronous code, you use next()
    throw HttpError("Can't find place for this user.", 404)
  }
  res.json({ place })
})


router.get('/:placeId', (req, res, next) => {
  const placeId = req.params.placeId;
  const place = DUMMY_PLACES.find(p => p.id === placeId)
  if(!place){
    return next(new HttpError("Can't find place for this id.", 404))
  }
  res.json({ place })
});

module.exports = router