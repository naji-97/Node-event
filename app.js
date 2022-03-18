const express = require('express')
// const ejs = require('ejs')
const mongoose = require('mongoose')
const db = require('./config/database')
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session');
const passport = require('passport')
const moment = require('moment')
// var expressLayouts = require('express-ejs-layouts');

const app = express()

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())


// Set Cookie Parser, sessions and flash
// flash-messages
app.use(flash());

app.use(session({
  secret : 'najiali',
  cookie: { maxAge: 60000 * 15 },
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session()); 

const port = process.env.PORT || 3000



require('dotenv').config()
// set the view engine to ejs
app.set('view engine', 'ejs');
// app.use(expressLayouts);

// set static folder
app.use(express.static('public'))
app.use(express.static('uploads'))


// bring events routes
const eventsRoute = require('./routes/event-routes')
const userRoute = require('./routes/user-routes')

app.get('*', (req,res, next)=>{
  res.locals.user = req.user || null
  res.locals.moment = moment;
  next()
})

// app.use(function (req, res, next) {
//   res.locals.user = require('express-messages')(req, res);
//   next();
// });


// Routes
app.use('/events', eventsRoute)
app.use('/users', userRoute)


app.get('*', (req, res)=>{
    res.redirect('events')
})

app.listen(port,()=> console.log(`App runing on ${port} `))