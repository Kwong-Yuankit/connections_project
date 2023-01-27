//require modules
const express = require('express'); 
const { request } = require('http'); 
const morgan = require('morgan'); //http request logger middleware
const methodOverride = require('method-override'); // Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it
const connectionRoutes = require('./routes/connectionRoutes'); // import connection routes from another folder
const mainRoutes = require('./routes/mainRoutes'); // import main routes from another folder
const userRoutes = require('./routes/userRoutes'); // import user routes from another folder
const mongoose = require('mongoose'); //MongoDB object modeling tool designed to work in an asynchronous environment
const session = require('express-session'); //session middleware
const MongoStore = require('connect-mongo'); //MongoDB session store
const { error } = require('console'); // import error from console
const flash = require('connect-flash'); //flash message middleware
const User = require('./models/user') // import user model


//create app
const app = express();

//configure app
let port = 3000;
let host = 'localhost';
let url = 'mongodb://localhost:27017/NBAD';
app.set('view engine', 'ejs');

//Connect to MongoDB
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true }) //useCreateIndex is not supported in mongoose 6
    .then(()=> {
        //start the server
        app.listen(port, host, () => {
        console.log('Server is running on port ', port);
        });
    })
    .catch(err => console.log(err.message));

//mount middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'DCCXXX-MCMXC',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60*60*1000 }, // 1 hour
    store: new MongoStore({mongoUrl: url})
}));

app.use(flash()); //can only be used after session middleware

app.use((req, res, next) => { //only prints out the session
    //console.log(req.session);
    res.locals.user = req.session.user||null; //store the user id to the session
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
})

//Set up routes
app.use('/connections', connectionRoutes); // for localhost:3000/connections/
app.use('/', mainRoutes) // for localhost:3000/
app.use('/users', userRoutes); // for localhost:3000/users/

//Error handling
app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    if(!err.status) {
        err.status = 500;
        err.message = ("Internal Server Error");
    }

    res.status(err.status);
    res.render('error', {error: err});
});

