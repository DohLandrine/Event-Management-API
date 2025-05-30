const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const attendeeSchema = new Schema(
    {
        name : {
            type: String,
            require: true
        },
        email: {
            type: String,
            require: true
        },
        event_id: {
            type: String,
            require: true
        }
    }
);

module.exports = attendeeSchema;