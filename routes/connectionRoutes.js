const express = require('express');
const controller = require('../controllers/connectionController');
const {isLoggedIn, isHost, isHostRSVP} = require('../middlewares/auth');
const {validateId, validateResult, validateConnection, validateTime, validateRSVP} = require('../middlewares/validator');

const router = express.Router();

//GET /connections: send all connections to the user
router.get('/', controller.index);

//GET /connections/new: send html form for creating a new connection
router.get('/new', isLoggedIn, controller.new);

//POST /connections: create a new connection
router.post('/', isLoggedIn, validateConnection, validateTime, validateResult, controller.create);

//GET /connections/:id: send details of connection identified by id
router.get('/:id', validateId, controller.show);

//GET /connections/:id/edit: send html form for editing a existing connection
router.get('/:id/edit', isLoggedIn, validateId, isHost, controller.edit);

//PUT /connections/:id: update the connection identified by id
router.put('/:id', isLoggedIn, validateId, isHost, validateConnection, validateTime, validateResult, controller.update);


//DELETE /connections/:id : delete the connection identiffied by id
router.delete('/:id', isLoggedIn, validateId, isHost, controller.delete);

//POST rsvp to a connection
router.post('/:id/rsvp', isLoggedIn, validateId, isHostRSVP, validateRSVP, validateResult, controller.rsvp);

module.exports = router;