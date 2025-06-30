const express = require('express');
const eventModel = require("../models/event_model");
const userModel = require("../models/user_model");
const eventController = require("../controllers/event_controller")

const router = express.Router();

// creating a new event
router.post('/create-event', eventController.createEvent);

// deleting an event
router.delete('/delete-event/:id', eventController.deleteEvent);

// modifying an event
router.put('/modify-event/:id', eventController.modifyEvent);

// getting all events
router.get('/get-all-events', eventController.getAllEvent);

// get an event by id
router.get('/get-event-by-id/:id', eventController.getAllEvent);

// searching an event by location and or date
router.get('/search',eventController.searchEvent);

module.exports = router;