const userModel = require("../models/user_model");
const bcrypt = require("bcryptjs");
const eventModel = require("../models/event_model");
const jwt = require("jsonwebtoken");

exports.verifyToken =  (request, response, next) => {
  const authHeader = request.headers["authorization"];
  token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return response.status(403).send("A token is required for authentication");
  }
  jwt.verify(token, "secret_key", (error, user) => {
    if (error) {
      return response.status(401).send("Invalid Token");
    }
    request.userId = user.id;
    next();
  }
  );
};

exports.rsvpForEvent = async (request, response) => {
      const eventId = request.params.eventId;
      const userId = request.userId;

      try {
        const user = await userModel.findById(userId);
        if (!user) {
          return response.status(404).send("User not found");
        }

        if (user.registeredEvents.includes(eventId)) {
          return response.status(400).send("Already registered for this event");
        }

        // Find the event to ensure it exists
        const event = await eventModel.findById(eventId);
        if (!eventId) {
          return response.status(404).send("Event not found");
        }
       
        // add the event to the user's registeredEvents array
        user.registeredEvents.push(eventId);
        await user.save();

        // add the user to the event's attendees array
        event.attendees.push(userId);
        await event.save();

        response.send("RSVP successful");
      } catch (error) {
        response.send(error.message);
      }
    }

exports.getAllRsvpedEvents = async (request, response) => {
    const userId = request.userId;

    try {
      const user = await userModel.findById(userId).populate("registeredEvents");
      if (!user) {
        return response.status(404).send("User not found");
      }

      response.json(user.registeredEvents);
    } catch (error) {
      response.status(500).send(error.message);
    }
  }

exports.unRsvpForEvent = async (request, response) => {
    const eventId = request.params.eventId;
    const userId = request.userId;

    try {
      const user = await userModel.findById(userId);
      if (!user) {
        return response.status(404).send("User not found");
      }

      if (!user.registeredEvents.includes(eventId)) {
        return response.status(400).send("Not registered for this event");
      }

      user.registeredEvents = user.registeredEvents.filter(id => id.toString() !== eventId);
      await user.save();
      response.send("Unregistered successfully");
    } catch (error) {
      response.status(500).send(error.message);
    }
  }

