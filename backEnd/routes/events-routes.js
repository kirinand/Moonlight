const express = require("express");
const { check } = require("express-validator");

const router = express.Router();

const eventsControllers = require("../controllers/events-controllers");

router.get("/:eid", eventsControllers.getEventById);

router.get("/user/:uid", eventsControllers.getEventsByUser);

router.post("/", 
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address')
      .not()
      .isEmpty()
  ], 
  eventsControllers.createEvent
);

router.patch("/:eid",
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').isLength({ min: 5 }),
    check('address')
      .not()
      .isEmpty()
  ], 
  eventsControllers.updateEvent
);

router.delete("/:eid", eventsControllers.deleteEvent);

module.exports = router;
