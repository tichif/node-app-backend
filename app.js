const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const HttpError = require('./models/http-error');
const placesRoutes = require('./routes/places');
const usersRoutes = require('./routes/users');

const app = express();

app.use(bodyParser.json());

// Serving files stactically
app.use('/uploads/images', express.static(path.join('uploads', 'images')));

// handle cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // allows any domain to access tho backend
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  ); // headers which should be sent by the client
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, POST, DELETE'); // allows these methods
  next();
});

app.use('/api/places', placesRoutes);
app.use('/api/users', usersRoutes);

// Implement unsupported routes error
app.use((req, res, next) => {
  const error = new HttpError('Could not found this route', 404);
  throw error;
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    }); // delete the file
  }
  if (res.headerSent) {
    return next(error);
  }
  res
    .status(error.code || 500)
    .json({ message: error.message || 'An unknown error occurred !!!' });
});

mongoose
  .connect(
    'mongodb+srv://tichif:tichif@mern.uovut.mongodb.net/mern?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    app.listen(5000, () => {
      console.log('App is running');
    });
  })
  .catch((err) => console.log(err));
