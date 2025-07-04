const express = require("express");
const eventRouter = require("./routes/event_api");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const dotenv = require("dotenv");
const authRouter = require("./routes/auth_api");
const userRouter = require("./routes/user_api");
const cors = require("cors");

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// Connect to mongodb
mongoose.connect(process.env.MONGO_URI,
).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});
mongoose.Promise = global.Promise; // mongoose promise is deprecated.

app.use(cors());
app.use(bodyParser.json());

app.use('/api/event', eventRouter);
app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.use(function(error, request, response, next){
    // Sends the error message to the client, and changes
    // the status code from 200 (OK) to 422 (Unprocessable entity).
    response.status(422).send({
        error : error.message
    }) 

});

app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});