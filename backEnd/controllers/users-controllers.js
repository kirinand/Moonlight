const { validationResult } = require("express-validator");

const HttpError = require('../models/http-error');
const User = require('../models/user');

// let DUMMY_USERS = [
//   {
//     id: 'u1',
//     name: 'Kirin Tang',
//     email: 'kirin@moonlight.com',
//     password: 'testing'
//   },
//   {
//     id: 'u2',
//     name: 'Dorian Tang',
//     email: 'Dorian@moonlight.com',
//     password: 'testing'
//   }
// ];

const getAllUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');  // or <'email, name'>
  } catch (err) {
    const error = new HttpError('Getting users failed, please try again', 500);
    return next(error);
  }
  res.json({ users: users.map(
    user => user.toObject({ getters: true })
  ) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new HttpError('Invalid inputs passed, please check your data.', 422);
    return next(error);
  }

  const { name, email, password } = req.body;
  
  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError('Signing up failed, please try again.', 500);
    return next(error);
  }
  
  if (existingUser) {
    const error = new HttpError('User already exists', 422);
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: 'https://dummyimage.com/600x400/000/fff',
    password,
    events: []
  }) 

  try {
    await createdUser.save();
  } catch {
    const error = new HttpError('Signup failed, please try again.', 500);
    return next(error);
  }

  res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError('Signing up failed, please try again.', 500);
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError('Invalid email or password, could not login.', 401);
    return next(error);
  }

  res.json({message: 'Logged in!'});
};

exports.getAllUsers = getAllUsers;
exports.signup = signup;
exports.login = login;