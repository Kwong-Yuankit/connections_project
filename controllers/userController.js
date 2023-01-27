const model = require('../models/user');
const Connection = require('../models/connection');
const RSVP = require('../models/rsvp');


//user signup login
exports.new = (req, res)=>{
    return res.render('./user/new');
};

exports.create = (req, res, next)=>{
    let user = new model(req.body); // create a new user
    if(user.email)
        user.email = user.email.toLowerCase();
    user.save()
        .then(user=>{
            req.flash('success', 'Registration succeeded!');
            res.redirect('/users/login')
        })
        .catch(err=>{
            if(err.name === 'ValidationError') {
                req.flash('error', err.message);
                return res.redirect('/users/new');
            }
            if(err.code === 11000) {
                req.flash('error', 'Email address has been used');
                return res.redirect('/users/new');
            }
            next(err)
        });
}

exports.getUserLogin = (req, res, next) => {
    return res.render('./user/login');
}

exports.login = (req, res, next)=> {
    //authenticate user's login request
    let email = req.body.email;
    if(email)
        email = email.toLowerCase();
    let password = req.body.password;
    //get the user that matches the email
    model.findOne({email: email})
    .then(user=>{
        if(!user){
            console.log('wrong email address');
            req.flash('error', 'Wrong email address');
            res.redirect('/users/login');
        } else {
            //user found in the database
            user.comparePassword(password)
            .then(result=>{
                if(result){
                    req.session.user = user._id; //store the user's id in the session
                    req.flash('success', 'You have successfully logged in');
                    res.redirect('/users/profile');
                } else {
                    req.flash('error', 'Wrong password');
                    res.redirect('/users/login');
                }
            });
        }
    })
    .catch(err=>next(err));
}

exports.profile = (req, res, next) => {
    let id = req.session.user;
    Promise.all([model.findById(id), Connection.find({host: id}), RSVP.find({user: id}).populate('connectionId', 'title type')])
    .then(results=>{
        const [user, connections, rsvps] = results;
        res.render('./user/profile', {user, connections, rsvps})
    })
    .catch(err=>next(err));
}

exports.logout = (req, res, next) => {
    req.session.destroy(err=>{
        if(err)
            return next(err);
        else
            res.redirect('/');
    });
    res.redirect('/');
}