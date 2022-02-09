const { v4: uuidv4 } = require('uuid');
const { validationResult } = require("express-validator");

const HttpError = require('../models/http-error');

let DUMMY_DATA = [
  {
    id: 'e1',
    title: 'Ourdoor Movie Night',
    description: 'Two films and dinner time in between, bring your friends!',
    imageUrl: 'https://dummyimage.com/600x400/000/fff',
    address: '3700 Willingdon Ave, Burnaby, BC V5G 3H2',
    location: {
      lat: 0,
      lng: 0
    },
    creator: 'u1'
  },
  {
    id: 'e2',
    title: 'Campus Movie Night',
    description: 'Two films and dinner time in between, bring your friends!',
    imageUrl: 'https://dummyimage.com/600x400/000/fff',
    address: '3700 Willingdon Ave, Burnaby, BC V5G 3H2',
    location: {
      lat: 0,
      lng: 0
    },
    creator: 'u1'
  }
];

const getEventById = (req, res, next) => {
  const eventId = req.params.eid;
  const event = DUMMY_DATA.find(evt => {
    return evt.id === eventId;
  });

  if (!event) {
    const error = new HttpError('Could not find a place for the provided id.', 404);
    return next(error);  // throw error; can be used if functions were synchronous
  }

  res.json({ event }); // { event } => { event: event }
};

const getEventsByUser = (req, res, next) => {
  const userId = req.params.uid;
  const events = DUMMY_DATA.filter(evt => {
    return evt.creator === userId;
  });

  if (!events || events.length === 0) {
    const error = new HttpError('Could not find places for the provided user id.', 404);
    return next(error);  // throw error; can be used if functions were synchronous
  }

  res.json({ events });
};

const createEvent = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError('Invalid inputs passed, please check your data.', 422);
  }

  const { title, description, coordinates, address, creator } = req.body; // const title = req.body.title .....
  const createdEvent = {
    id: uuidv4(),
    title,  // title: title
    description,
    location: coordinates, 
    address, 
    creator
  };

  DUMMY_DATA.push(createEvent); // or unshift(createEvent);

  res.status(201).json({ event: createdEvent });  // created sth new
};

const updateEvent = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError('Invalid inputs passed, please check your data.', 422);
  }

  const { title, description, coordinates, address } = req.body;
  const eventId = req.params.eid;

  const updatedEvent = {...DUMMY_DATA.find(evt => evt.id === eventId)};
  const eventIndex = DUMMY_DATA.findIndex(evt => evt.id === eventId);
  updatedEvent.title = title;
  updatedEvent.description = description;
  updatedEvent.location = coordinates;
  updatedEvent.address = address;

  DUMMY_DATA[eventIndex] = updatedEvent;

  res.status(200).json({ event: updatedEvent });
};

const deleteEvent = (req, res, next) => {
  const eventId = req.params.eid;
  if (!DUMMY_DATA.find(evt => evt.id === eventId)) {
    throw new HttpError("Could not find an event for that id.", 404);
  }

  DUMMY_DATA = DUMMY_DATA.filter(evt => evt.id !== eventId);
  res.status(200).json({ message: 'Deleted event.' });
};

exports.getEventById = getEventById;
exports.getEventsByUser = getEventsByUser;
exports.createEvent = createEvent;
exports.updateEvent = updateEvent;
exports.deleteEvent = deleteEvent;