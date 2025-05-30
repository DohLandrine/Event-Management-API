const express = require("express");
const router = require("./routes/event_api");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();
const port = 3000;

// Connect to mongodb
mongoose.connect('mongodb://localhost/event-management');
mongoose.Promise = global.Promise; // mongoose promise is deprecated.

app.use(bodyParser.json());

app.use('/api', router);

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