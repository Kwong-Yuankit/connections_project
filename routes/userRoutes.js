const express = require('express');
const controller = require('../controllers/userController');
const {isGuest, isLoggedIn} = require('../middlewares/auth');
const {logInLimiter} = require('../middlewares/rateLimiters');
const {validateSignUp, validateLogIn, validateResult} = require('../middlewares/validator');

const router = express.Router();

//signup, login, profile, logout
router.get('/new', isGuest, controller.new); //get signup form
router.post('/', isGuest, validateSignUp, validateResult, controller.create); //create a new user
router.get('/login', isGuest, controller.getUserLogin); //get login form
router.post('/login', logInLimiter, isGuest, validateLogIn, validateResult, controller.login); //authenticate user login 
router.get('/profile', isLoggedIn, controller.profile); //get user's profile page
router.get('/logout', isLoggedIn, controller.logout); //logout a user


module.exports = router;