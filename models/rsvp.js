const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema ({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    connectionId: {type: Schema.Types.ObjectId, ref: 'Connection'},
    status: {type: String, required: [true, 'RSVP Status is Required'], enum: ['Yes', 'No', 'Maybe']},
})

module.exports = mongoose.model('RSVP', rsvpSchema);