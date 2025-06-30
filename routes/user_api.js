const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/user_controller");

const verifyToken = userController.verifyToken;

  // RSVP for an event
  userRouter.post("/rsvp/:eventId", verifyToken, userController.rsvpForEvent);

  // get all event RSVPed for
  userRouter.get("/rsvp-events", verifyToken, userController.getAllRsvpedEvents);

  // Unrsvp for an event
  userRouter.patch("/unrsvp/:eventId", verifyToken, userController.unRsvpForEvent);

  module.exports = userRouter;