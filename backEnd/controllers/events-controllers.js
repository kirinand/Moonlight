// const { v4: uuidv4 } = require('uuid');
const { validationResult } = require("express-validator");
const mongoose = require("mongoose");

const HttpError = require('../models/http-error');
const Event = require('../models/event');
const User = require('../models/user');

// let DUMMY_DATA = [
//   {
//     id: 'e1',
//     title: 'Ourdoor Movie Night',
//     description: 'Two films and dinner time in between, bring your friends!',
//     imageUrl: 'https://dummyimage.com/600x400/000/fff',
//     address: '3700 Willingdon Ave, Burnaby, BC V5G 3H2',
//     location: {
//       lat: 0,
//       lng: 0
//     },
//     creator: 'u1'
//   },
//   {
//     id: 'e2',
//     title: 'Campus Movie Night',
//     description: 'Two films and dinner time in between, bring your friends!',
//     imageUrl: 'https://dummyimage.com/600x400/000/fff',
//     address: '3700 Willingdon Ave, Burnaby, BC V5G 3H2',
//     location: {
//       lat: 0,
//       lng: 0
//     },
//     creator: 'u1'
//   }
// ];

const getEventById = async (req, res, next) => {
  const eventId = req.params.eid;
  
  let event;
  try {
    event = await Event.findById(eventId);
  } catch {
    const error = new HttpError('Something went wrong, could not find an event.', 500);
    return next(error);
  }
  
  // DUMMY_DATA.find(evt => {
  //   return evt.id === eventId;
  // });

  if (!event) {
    const error = new HttpError('Could not find a event for the provided id.', 404);
    return next(error);  // throw error; can be used if synchronous
  }

  res.json({ event: event.toObject({ getters: true }) }); // { event } => { event: event }
};

const getEventsByUser = async (req, res, next) => {
  const userId = req.params.uid;
  let user;
  try {
    user = await User.findById(userId).populate('events');
  } catch {
    const error = new HttpError('Something went wrong, could not fetch any event.', 500);
    return next(error);
  }
  // DUMMY_DATA.filter(evt => {
  //   return evt.creator === userId;
  // });

  if (!user || user.events.length === 0) {
    const error = new HttpError('Could not find events for the provided user id.', 404);
    return next(error);  // throw error; can be used if functions were synchronous
  }

  res.json({ events: user.events.map(
    event => event.toObject({ getters: true })) 
  });
};

const createEvent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError('Invalid inputs passed, please check.', 422);
  }

  const { title, description, address, creator } = req.body; // const title = req.body.title .....
  const createdEvent = new Event({
    title,  // title: title
    description,
    address,
    location: {
      lat: 0,
      lng: 0
    },
    image: 'https://dummyimage.com/600x400/000/fff',
    creator
  });

  let user;
  try {
    user = await User.findById(creator);
  } catch (err) {
    return next(
      new HttpError('Creating event failed, please try again.', 500)
    );
  }

  if (!user) {
    return next(
      new HttpError('Could not find user.', 404)
    );
  }

  console.log(user);

  // {
  //   id: uuidv4(),
  // };

  try {
    const session = await mongoose.startSession(); 
    session.startTransaction();
    await createdEvent.save({ session: session });
    user.events.push(createdEvent);
    await user.save({ session: session });
    await session.commitTransaction();
  } catch {
    const error = new HttpError('Creating event failed, please try again.', 500);
    return next(error);
  }
  
  // DUMMY_DATA.push(createEvent); // or unshift(createEvent);

  res.status(201).json({ event: createdEvent });  // created sth new
};

const updateEvent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new HttpError('Invalid inputs passed, please check your data.', 422);
    return next(error);
  }

  const { title, description, address } = req.body;
  const eventId = req.params.eid;

  let event;
  try {
    event = await Event.findById(eventId);
  } catch {
    const error = new HttpError("Something went wrong, could not update event.", 500);
    return next(error);
  }

  // const updatedEvent = {...DUMMY_DATA.find(evt => evt.id === eventId)};
  // const eventIndex = DUMMY_DATA.findIndex(evt => evt.id === eventId);
  // DUMMY_DATA[eventIndex] = updatedEvent;

  event.title = title;
  event.description = description;
  event.address = address;

  try {
    await event.save();
  } catch {
    const error = new HttpError("Could not update event.", 500);
    return next(error);
  }

  res.status(200).json({ event: event.toObject({ getters: true }) });
};

const deleteEvent = async (req, res, next) => {
  const eventId = req.params.eid;

  let event;
  try {
    event = await Event.findById(eventId).populate('creator');  // populate() needs mutual reference
  } catch {
    const error = new HttpError("Something went wrong, could not delete event.", 500);
    return next(error);
  }

  if (!event) {
    const error = new HttpError('Could not find event.', 404);
    return next(error);
  }

  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await event.remove({ session: session });
    event.creator.events.pull(event);
    await event.creator.save({ session: session });
    await session.commitTransaction();
  } catch {
    const error = new HttpError("Something went wrong, could not delete event.", 500);
    return next(error);
  } 
  
  // if (!DUMMY_DATA.find(evt => evt.id === eventId)) {
  //   throw new HttpError("Could not find an event for that id.", 404);
  // }
  // DUMMY_DATA = DUMMY_DATA.filter(evt => evt.id !== eventId);
  res.status(200).json({ message: 'Deleted event.' });
};

exports.getEventById = getEventById;
exports.getEventsByUser = getEventsByUser;
exports.createEvent = createEvent;
exports.updateEvent = updateEvent;
exports.deleteEvent = deleteEvent;