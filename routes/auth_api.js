const express = require("express");
const authController = require("../controllers/auth_controller");
const authRouter = express.Router();

// create a new user
authRouter.post("/create-user", authController.createUser);

  // login
authRouter.post("/login", authController.login);

module.exports = authRouter;
