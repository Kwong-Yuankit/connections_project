const model = require('../models/connection');
const RSVP = require('../models/rsvp');

exports.index = (req, res, next) => {
    model.find()
    .then(connections => {
        // function to store all unique connection types
        function getConnectionTypes (connections) {
            let types = [];
            connections.forEach(connection => {
                if(!types.includes(connection.type)) {
                    types.push(connection.type);
                }
            });
            return types;
        }
        let category = getConnectionTypes(connections);
        res.render('./connection/index', {connections, category});
    })
    .catch(err => next(err)); 
};

exports.new = (req, res) => {
    res.render('./connection/new');
};

exports.create = (req, res, next) => {
    let connection = new model(req.body); //create a new connection document
    connection.host = req.session.user;
    connection.save() //insert document to the database
    .then((connection) => res.redirect('/connections'))
    .catch(err=>{
        if(err.name === 'ValidationError') {
            err.status = 400;
            req.flash('error', 'Validation Error');
            res.redirect('back');
        }
        next(err);
    });
};

exports.show =  (req, res, next) => {
    let id = req.params.id;

    //Count the number of Yes RSVPs
    let count = 0;
    RSVP.count({connectionId:id, status:'Yes'}, function( err, data){
        count = data;
    });

    model.findById(id).populate('host', 'firstName lastName' )
    .then(connection=>{
        if(connection) {
            return res.render('./connection/show', {connection, count:count});
        } else {
            let err = new Error('Cannot find a connection with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

exports.edit = (req, res, next) => {
    let id = req.params.id;

    model.findById(id)
    .then(connection=>{
        return res.render('./connection/edit', {connection});
    })
    .catch(err=>next(err));
};

exports.update = (req, res, next) => {
    let connection = req.body;
    let id = req.params.id;

    model.findByIdAndUpdate(id, connection, {useFindAndModify: false, runValidators: true})
    .then(connection=>{
        req.flash('success', 'Connection successfully updated');
        res.redirect('/connections/'+id);
    })
    .catch(err=>{
        if(err.name === 'ValidationError') {
            err.status = 400;
            req.flash('error', 'Validation Error');
            res.redirect('back');
        }
        next(err)
    });
};

exports.delete =  (req, res, next) => {
    let id = req.params.id;
    //promise to delete rsvp and connections
    Promise.all([RSVP.deleteMany({connectionId: id}), model.findByIdAndDelete(id, {useFindAndModify: false})])
    .then(connection => {
        req.flash('success', 'Connection successfully deleted');
        res.redirect('/connections');
    })
    .catch(err=>next(err))
};



exports.rsvp = (req, res, next) => {
    let id = req.params.id;
    
    let rsvpStatus = req.body.rsvp.charAt(0).toUpperCase() + req.body.rsvp.slice(1).toLowerCase();
    let rsvp = ({connectionId: id, user: req.session.user, status: rsvpStatus});
    RSVP.findOneAndUpdate({connectionId: id, user: req.session.user}, rsvp, {upsert: true, new: true, runValidators: true})
    .then(rsvp=>{
        if(rsvp) {
            req.flash('success', 'RSVP updated successfully');
            res.redirect('/users/profile');
        }
    })
    .catch(err=>next(err));
};




