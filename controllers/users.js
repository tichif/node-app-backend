const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

const DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Charly',
    email: 'charlby5@gmail.com',
    password: '12345678',
  },
];

exports.getUsers = (req, res, next) => {
  res.status(200).json({ users: DUMMY_USERS });
};

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs, passed, please checked your data', 422)
    );
  }

  const { name, email, password, places } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError('Sign up failed !!! Please try later', 500);
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'This email already exists, please try another.',
      422
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image:
      'https://www.liberaldictionary.com/wp-content/uploads/2018/12/men-1.jpg',
    password,
    places,
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError('Sign up failed !!! Please try later', 500);
    return next(error);
  }
  return res
    .status(201)
    .json({ user: createdUser.toObject({ getters: true }) });
};

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find((u) => u.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new Error('Email or password incorrect', 401);
  }

  res.status(200).json({ message: 'Login !!!' });
};
