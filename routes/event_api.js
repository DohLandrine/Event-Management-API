const express = require('express');
const eventModel = require("../models/event_model");
const userModel = require("../models/user_model");

const router = express.Router();

// creating a new event
router.post('/create-event', (request, respond, next) => {
   eventModel.create(request.body).then(
    (event) => {
        respond.send(event);
    }
   ).catch(next); 
});

// deleting an event
router.delete('/delete-event/:id',(request, response, next)=>{
    const eventId = request.params.id;
    eventModel.findByIdAndDelete(
        eventId
    ).then(
        async (event) => {
            await userModel.updateMany(
                { registeredEvents: eventId },           // Find users with the event ID in registeredEvents
                { $pull: { registeredEvents: eventId } } // Remove the event ID from the array
            );
            response.send(event);
        }
    ).catch(next);
});

// modifying an event
router.put('/modify-event/:id', (request, response, next) => {
    eventModel.findByIdAndUpdate({
        _id: request.params.id}, request.body

    ).then(()=>{
        eventModel.findById(
            {_id : request.params.id}
        ).then(
            (updatedEvent) => {
                response.send(updatedEvent);
            }
        ).catch(next);
    }).catch(next);
});

// getting all events
router.get('/get-all-events',(request, response, next) => {
    eventModel.find().then(
        (events) => {
            response.send(events);
        }
    ).catch(next);
});

// get an event by id
router.get('/get-event-by-id/:id', (request,response,next) => {
    eventModel.findById(
        {_id : request.params.id}
    ).then(
        (foundEvent) => {
            response.send(foundEvent);
        }
    ).catch(next);
});

// searching an event by location and or date
router.get('/search',async(request, response, next)=> {
    try{
        const {date, location} = request.query;
        const filter = {};

        if(date){
            filter.date = date; // remember that it is the YY/MM/DD format
        }

        if(location){
            filter.location = {$regex: location, $options: 'i'}
        }

        const events = await eventModel.find(filter);
        response.send(events);
    }catch(error){
        // console.log(error);
        response.status(500).json({message: 'Server Error'});
    }
    
});

module.exports = router;