const { validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const User = require('../models/user');

exports.getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError('Fetching users failed !!!', 500);
    return next(error);
  }

  res
    .status(200)
    .json({ users: users.map((user) => user.toObject({ getters: true })) });
};

exports.signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs, passed, please checked your data', 422)
    );
  }

  const { name, email, password } = req.body;

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
    places: [],
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

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError('Log in failed !!! Please try later', 500);
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError('Invalid credentials', 401);
    return next(error);
  }

  res.status(200).json({ message: 'Login !!!' });
};
