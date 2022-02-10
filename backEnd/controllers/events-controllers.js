// const { v4: uuidv4 } = require('uuid');
const { validationResult } = require("express-validator");

const HttpError = require('../models/http-error');
const Event = require('../models/event');

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
    const error = new HttpError('Could not find a place for the provided id.', 404);
    return next(error);  // throw error; can be used if synchronous
  }

  res.json({ event: event.toObject({ getters: true }) }); // { event } => { event: event }
};

const getEventsByUser = async (req, res, next) => {
  const userId = req.params.uid;
  let events;
  try {
    events = await Event.find({ creator: userId }); // return an array in mongoose (a cursor in vanilla mongoDB)
  } catch {
    const error = new HttpError('Something went wrong, could not fetch any event.', 500);
    return next(error);
  }
  // DUMMY_DATA.filter(evt => {
  //   return evt.creator === userId;
  // });

  if (!events || events.length === 0) {
    const error = new HttpError('Could not find places for the provided user id.', 404);
    return next(error);  // throw error; can be used if functions were synchronous
  }

  res.json({ events: events.map(
    event => event.toObject({ getters: true })) 
  });
};

const createEvent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError('Invalid inputs passed, please check your data.', 422);
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
  // {
  //   id: uuidv4(),
  //   title,  // title: title
  //   description,
  //   location: coordinates, 
  //   address, 
  //   creator
  // };

  try {
    await createdEvent.save();
  } catch {
    const errot = new HttpError('Creating event failed, please try again.', 500);
    return next(errot);
  }
  
  // DUMMY_DATA.push(createEvent); // or unshift(createEvent);

  res.status(201).json({ event: createdEvent });  // created sth new
};

const updateEvent = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    throw new HttpError('Invalid inputs passed, please check your data.', 422);
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
    event = await Event.findById(eventId);
  } catch {
    const error = new HttpError("Something went wrong, could not delete event.", 500);
    return next(error);
  }

  try {
    await event.remove();
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