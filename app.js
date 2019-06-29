'use strict';

var express = require('express');
var app = express();
var routes = require('./routes');

var Grid = require('gridfs-stream');
var methodOverride = require('method-override');

var jsonParser = require('body-parser');
var logger = require('morgan');

var mongoose = require('mongoose');

var session = require('express-session');

app.locals.moment = require('moment');



// use sessions for tracking logins
app.use(session({
    secret: 'rgero215',
    resave: true,
    saveUninitialized: false
}));

// make user ID available in templates
app.use(function(req, res, next){
    res.locals.currentUser = req.session.uid;
    res.locals.is_admin = req.session.is_admin;
    next();
})



mongoose.set('useCreateIndex', true);

var mongoURI = 'mongodb://localhost:27017/birdman_bats'
mongoose.connect(mongoURI, { useNewUrlParser: true });

var db = mongoose.connection;


db.on('error', (err) => {
    console.error('Connection error: ');
})


db.once('open', () => {
    console.log('db connection successful');
});

// var mongoURI = 'mongodb://rgero215:rgero215@ds149616.mlab.com:49616/birdman_bats'
// var conn = mongoose.createConnection(mongoURI);



// conn.once('open', () => {
//     // Init stream
//     gfs = Grid(db.db, mongoose.mongo);
//     gfs.collection('uploads');
// })

// serve static files from /public
app.use(express.static(__dirname + '/public'));

// view engine setup
app.set('view engine', 'pug');
app.set('views', __dirname + '/views');

app.use(logger('dev'));

// parse incoming requests
app.use(jsonParser.json());
app.use(jsonParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));


// Grant access from browser    
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE');
        return res.status(200).json({});
    }
    next();
}) 

app.use('/users', routes)

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    var err = new Error('Not Found');
    err.status = 404;
    res.render('404')
    // next(err);
});

// Error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});


var port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log('Express server is listening on port:', port);
});
