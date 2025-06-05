const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const eventModel = require("./event_model"); 

const userSchema = new Schema(
    {
        name : {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        registeredEvents: [
            {
                type: Schema.Types.ObjectId,
                ref: "event", // Reference to the Event model
            }
        ],
    }
);

const userModel = mongoose.model("users", userSchema);
module.exports = userModel;