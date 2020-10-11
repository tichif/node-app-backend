const express = require('express')

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
  const places = DUMMY_PLACES.find(p => p.creator === userId)
  res.json({ places })
})


router.get('/:placeId', (req, res) => {
  const placeId = req.params.placeId;
  const place = DUMMY_PLACES.find(p => p.id === placeId)
  res.json({ place })
});


module.exports = router