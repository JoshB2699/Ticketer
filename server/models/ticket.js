var mongoose = require('mongoose');

var ticketSchema = mongoose.Schema({
        name  : String,
        room  : String,
        desc  : String,
        author : String,
});

module.exports = mongoose.model('Ticket', ticketSchema);
