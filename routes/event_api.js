const express = require('express');
const eventModel = require("../models/event_model");

const router = express.Router();

router.post('/create-event', (request, respond, next) => {
   eventModel.create(request.body).then(
    (event) => {
        respond.send(event);
    }
   ).catch(next); 
});

router.delete('/delete-event/:id',(request, response, next)=>{
    eventModel.findByIdAndDelete(
        request.params.id
    ).then(
        (event) => {
            response.send(event);
        }
    ).catch(next);
});

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

router.get('/get-all-event',(request, response, next) => {
    eventModel.find().then(
        (events) => {
            response.send(events);
        }
    ).catch(next);
});

router.get('/get-event-by-id/:id', (request,response,next) => {
    eventModel.findById(
        {_id : request.params.id}
    ).then(
        (foundEvent) => {
            response.send(foundEvent)
        }
    ).catch(next);
});

module.exports = router;