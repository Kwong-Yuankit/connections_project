const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//create a schema
const connectionSchema = new Schema({
    type: {type: String, required: [true, 'Connection Type is Required']},
    title: {type: String, required: [true, 'Title is Required']},
    host: {type: Schema.Types.ObjectId, ref: 'User'}, //host is a reference to the User model
    details: {type: String, required: [true, 'Details are Required'],
              minLength: [10, 'Details must be at least 10 characters']},
    date: {type: Date, required: [true, 'Date is Required']},
    starttime: {type: String, required: [true, 'Start Time is Required']},
    endtime: {type: String, required: [true, 'End Time is Required']},
    location: {type: String, required: [true, 'Location is Required']},
    imgURL: {type: String, required: [true, 'Image URL is Required']},
    },
    {timestamps: true}
);


//Collection name is connections in the database
module.exports = Connection = mongoose.model('Connection', connectionSchema);

