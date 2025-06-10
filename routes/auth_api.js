const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const userModel = require("../models/user_model");

const authRouter = express.Router();

// create a new user
authRouter.post("/create-user", async (request, response) => {
  const name = request.body.name;
  const password = request.body.password;

  // encrypting the password
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

  // login
  authRouter.post("/login", async (request, response) => {
    //console.log("Login route hit");
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
          response.json({ token: token , id: user._id, name: user.name });
        } else {
          response.status(400).send("Invalid password");
        }
      }
    });
  });

module.exports = authRouter;
