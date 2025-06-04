const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const userModel = require('../models/user_model');

const authRouter = express.Router();

authRouter.post('/create-user', async(request, response) => {
    const name = request.body.name;
    const password = request.body.password;

    const hashedPassword = await bcrypt.hash(password, 10);
    userModel.findOne({ name: name }).then(
        (user) => {
            if (user) {
                response.status(400).send("User already exists");
            } else {
                userModel.create({
                    "name": name,
                    "password": hashedPassword
                }).then(
                    (user) => {
                        response.send(user);
                    }
                );
            }
        }
    );

    userModel.post('login', async(request, response) => {
        const name = request.body.name;
        const password = request.body.password;

        userModel.findOne({ name: name }).then(
            async (user) => {
                if (!user) {
                    response.status(400).send("User not found");
                } else {
                    const isPasswordValid = await bcrypt.compare(password, user.password);
                    if (isPasswordValid) {
                        const token = jwt.sign({ id: user._id }, 'secret_key', { expiresIn: '1h' });
                        response.json({ token: token });
                    } else {
                        response.status(400).send("Invalid password");
                    }
                }
            }
        );
    }
    );

    function verifyToken(request, response, next) {
        const token = request.headers['authorization'];
        if (!token) {
            return response.status(403).send("No token provided");
        }
        jwt.verify(token, 'secret_key', (err, decoded) => {
            if (err) {
                return response.status(500).send("Failed to authenticate token");
            }
            request.userId = decoded.id;
            next();
        });
    }
}
)

module.exports = authRouter;