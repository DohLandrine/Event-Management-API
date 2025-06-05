const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user_model");

const authRouter = express.Router();

authRouter.post("/create-user", async (request, response) => {
  const name = request.body.name;
  const password = request.body.password;

  const hashedPassword = await bcrypt.hash(password, 10);
  userModel.findOne({ name: name }).then((user) => {
    if (user) {
      response.status(400).send("User already exists");
    } else {
      userModel
        .create({
          name: name,
          password: hashedPassword,
        })
        .then((user) => {
          response.send(user);
        });
    }
  });
});

  authRouter.post("/login", async (request, response) => {
    console.log("Login route hit");
    const name = request.body.name;
    const password = request.body.password;

    userModel.findOne({ name: name }).then(async (user) => {
      if (!user) {
        response.status(400).send("User not found");
      } else {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
          const token = jwt.sign({ id: user._id }, "secret_key", {
            expiresIn: "300h",
          });
          response.json({ token: token });
        } else {
          response.status(400).send("Invalid password");
        }
      }
    });
  });

const verifyToken = (request, response, next) => {
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

  authRouter.post("/rsvp/:eventId", verifyToken,
    async (request, response) => {
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

        user.registeredEvents.push(eventId);
        await user.save();
        response.send("RSVP successful");
      } catch (error) {
        response.send(error.message);
      }
    }
  );

  authRouter.get("/rsvp-events", verifyToken, async (request, response) => {
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
  );
module.exports = authRouter;
