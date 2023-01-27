const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');

const userSchema = new Schema({
    firstName: {type: String, required: [true, 'First Name is Required']},
    lastName: {type: String, required: [true, 'Last Name is Required']},
    email: {type: String, required: [true, 'Email is Required'], unique: true},
    password: {type: String, required: [true, 'Password is Required']},
    rsvp: [{type: Schema.Types.ObjectId, ref: 'RSVP'}],
});

//replace plaintext password with hashed password before saving the document in the database
//pre middleware

userSchema.pre('save', function(next) {
    let user = this;
    if(!user.isModified('password'))
        return next();
    bcrypt.hash(user.password, 10)
    .then(hash => {
        user.password = hash;
        next();
    })
    .catch(err=>next(err));
});

//implement a method to compare the login password and the hash stored in the database
userSchema.methods.comparePassword = function(loginPassword) {
    return bcrypt.compare(loginPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);