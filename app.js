const express = require("express");
// const ejs = require('ejs')
const mongoose = require("mongoose");
const db = require("./config/database");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session)
const moment = require("moment");
const passport = require('passport')
// var expressLayouts = require('express-ejs-layouts');

const app = express();

require("dotenv").config();


// Connect mongoose
mongoose.connect(process.env.DB_URI, 
  {useNewUrlParser: true}
  )
.then(()=>console.log('connect to db success'))
.catch(err=>console.log(err))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Set Cookie Parser, sessions and flash
// flash-messages
app.use(flash());

//-momery unleaked---------
app.set("trust proxy", 1);

// app.use(
//   session({
//     cookie: {
//       secure: true,
//       maxAge: 60000,
    
//     store: MongoStore.create({mongUrl: process.env.DB_URI}),
//     secret: "secret",
//     saveUninitialized: true,
//     resave: false,
//   },
//   })
// );

const store = new MongoStore({
  uri: process.env.DB_URI,
  databaseName: 'chatter',
  collection: 'sessions',
})

store.on('error', err => {
  throw new Error(err)
})

app.use(
  session({
      secret: 's3cr3tK3y',
      store: store,
      resave: false,
      saveUninitialized: false,
  }),
)


app.use(function (req, res, next) {
  if (!req.session) {
    return next(new Error("Oh no")); //handle error
  }
  next(); //otherwise continue
});

app.use(passport.initialize());
app.use(passport.session());

const port = process.env.PORT || 5000;

// set the view engine to ejs
app.set("view engine", "ejs");
// app.use(expressLayouts);

// set static folder
app.use(express.static("public"));
app.use(express.static("uploads"));

// bring events routes
const eventsRoute = require("./routes/event-routes");
const userRoute = require("./routes/user-routes");

app.get("*", (req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.moment = moment;
  next();
});

// app.use(function (req, res, next) {
//   res.locals.user = require('express-messages')(req, res);
//   next();
// });

// Routes
app.use("/events", eventsRoute);
app.use("/users", userRoute);

app.get("*", (req, res) => {
  res.redirect("events");
});

app.listen(port, () => console.log(`App runing on ${port} `));
