const { v4:uuidv4 } = require('uuid')
const { validationResult } = require('express-validator')

const HttpError = require('../models/http-error')

const DUMMY_USERS = [
  {
    id : 'u1',
    name : 'Charly',
    email : 'charlby5@gmail.com',
    password : '12345678'
  }
]

exports.getUsers = (req, res, next) => {
  res.status(200).json({ users : DUMMY_USERS })
}

exports.signup = (req, res, next) => {

  const errors = validationResult(req);
  if(!errors.isEmpty()){
    throw new HttpError('Invalid inputs, passed, please checked your data', 422)
  }

  const { name, email, password } = req.body

  const hasUser = DUMMY_USERS.find(u => u.email === email);
  if(hasUser){
    throw new HttpError('This user already exist', 422)
  }

  const createdUser = { id : uuidv4()  ,name, email, password }

  DUMMY_USERS.push(createdUser);
  return res.status(201).json({ user : createdUser }) 
}

exports.login = (req, res, next) => {
  const { email, password } = req.body;

  const identifiedUser = DUMMY_USERS.find(u => u.email === email);
  if(!identifiedUser || identifiedUser.password !== password){
    throw new Error("Email or password incorrect", 401)
  }

  res.status(200).json({ message : "Login !!!"})
}