var mongoose = require('mongoose');

var ticketSchema = mongoose.Schema({
        name  : String,
        room  : String,
        desc  : String,
        author : String,
        status : String,
        assigned : String,
        //Reported, In Progress, Completed
});

module.exports = mongoose.model('Ticket', ticketSchema);
