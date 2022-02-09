const { v4: uuidv4 } = require('uuid');
const { validationResult } = require("express-validator");

const HttpError = require('../models/http-error');

let DUMMY_USERS = [
  {
    id: 'u1',
    name: 'Kirin Tang',
    email: 'kirin@moonlight.com',
    password: 'testing'
  },
  {
    id: 'u2',
    name: 'Dorian Tang',
    email: 'Dorian@moonlight.com',
    password: 'testing'
  }
];

const getAllUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS }); 
};

const signup = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError('Invalid inputs passed, please check your data.', 422);
  }

  const { name, email, password } = req.body;
  
  const hasUser = DUMMY_USERS.find(user => user.email === email);
  if (hasUser) {
    throw new HttpError('Could not create user, email already exists.', 422);
  }

  const createdUser = {
    id: uuidv4(),
    name,
    email,
    password
  };

  DUMMY_USERS.push(createdUser);

  res.status(201).json({ user: createdUser });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  const identifiedUser = DUMMY_USERS.find(user => user.email === email);
  if (!identifiedUser || identifiedUser.password !== password) {
    throw new HttpError('Could not identify user, wrong credentials.', 401);
  }

  res.json({message: 'Logged in!'});
};

exports.getAllUsers = getAllUsers;
exports.signup = signup;
exports.login = login;