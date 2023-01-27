const {body} = require('express-validator');
const {validationResult} = require('express-validator');

//check is the route parameter is a valid ObjectId type value
exports.validateId = (req, res, next)=> {
    let id = req.params.id;
    if(id.match((/^[0-9a-fA-F]{24}$/))) {
        return next();
    } else {
        let err = new Error('Invalid id');
        err.status = 400;
        return next(err);
    }
};

exports.validateSignUp = [body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
    body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
    body('email','Email must be valid email address').isEmail().trim().escape().normalizeEmail(),
    body('password', 'Password must be between 8-64 characters').isLength({min: 8, max: 64})];

exports.validateLogIn = [body('email','Email must be valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be between 8-64 characters').isLength({min: 8, max: 64})];

exports.validateResult = (req, res, next) => {
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } else {
        return next();
    }
};

//validator for rsvp response
exports.validateRSVP = [
    body('rsvp', 'RSVP must be Yes, No, or Maybe').isIn([,'YES','Yes', 'yes','NO', 'No','no','MAYBE', 'Maybe', 'maybe']).trim().escape(),

];

//validate connection inputs
exports.validateConnection = [
    body('type', 'Type must be at least 3 characters long').trim().escape().isLength({min: 3, max: 64}).unescape(),
    body('title', 'Title must be at least 3 characters long').trim().escape().isLength({min: 3, max: 64}).unescape(),
    body('details','Details cannot be empty (10 characters minimum)').trim().escape().isLength({min: 10, max: 64}).unescape(),
    body('location', 'Last name cannot be empty').notEmpty().trim().escape().unescape(),
    body('date', 'Date must be a valid date').isDate().isAfter().trim().escape(),
    body('starttime', 'Start time must be a valid time').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).trim().escape(),
    body('endtime', 'End time must be a valid time').matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/).trim().escape(),
    body('imgURL', 'Image URL must be a valid URL').isURL().trim().escape().unescape()
    ];




//end time after start time validator
exports.validateTime = (req, res, next) => {
    let starttime = req.body.starttime;
    let endtime = req.body.endtime;
    if(starttime > endtime) {
        req.flash('error', 'End time must be after start time');
        return res.redirect('back');
    } else {
        return next();
    }
}