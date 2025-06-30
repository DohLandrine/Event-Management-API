const eventModel = require("../models/event_model");

exports.createEvent = (request, respond, next) => {
   eventModel.create(request.body).then(
    (event) => {
        respond.send(event);
    }
   ).catch(next); 
} 

exports.deleteEvent = (request, response, next)=>{
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
}

exports.modifyEvent = (request, response, next) => {
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
}

exports.getAllEvent = (request,response,next) => {
    eventModel.findById(
        {_id : request.params.id}
    ).then(
        (foundEvent) => {
            response.send(foundEvent);
        }
    ).catch(next);
}

exports.searchEvent = async(request, response, next)=> {
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
        next();
    }catch(error){
        // console.log(error);
        response.status(500).json({message: 'Server Error'});
    }
    
}