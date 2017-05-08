var mongoose = require('mongoose');

var ticketSchema = mongoose.Schema({
        name  : String,
        room  : String,
        desc  : String,
        author : String,
        status : String,         //Reported, In Progress, Completed
        isArchived : Boolean,
        assigned : String,
});

module.exports = mongoose.model('Ticket', ticketSchema);
