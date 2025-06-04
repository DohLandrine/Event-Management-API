const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema(
    {
        name : {
            type: String,
            required: true
        },
        date: {
            type: String, // e.g., '2025-06-10'
            required: true,
            match: /^\d{4}-\d{2}-\d{2}$/ // YYYY-MM-DD format
        },
        time: {
            type: String, // e.g., '14:00' (24-hour format)
            required: true,
            match: /^([01]\d|2[0-3]):([0-5]\d)$/ // HH:mm format
        },
        location: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        organizer : {
            required : true,
            type: String
        }
    }
);

const eventModel = mongoose.model('event', eventSchema);

module.exports = eventModel;