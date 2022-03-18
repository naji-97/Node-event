const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const { body, validationResult } = require("express-validator");
const moment = require("moment"); // require
moment().format();


// midleware to check isAuthenticated
isAuthenticated= (req,res,next)=>{
  if (req.isAuthenticated()) return next()
  res.redirect('/users/login')
}

// route to home events
router.get('/', (req,res)=> {   
  
      Event.find({}, (err,events)=> {
          //     res.json(events)
               let chunk = []
               let chunkSize = 3
               for (let i =0 ; i < events.length ; i+=chunkSize) {
                   chunk.push(events.slice( i, chunkSize + i))
               }
               //res.json(chunk)
                res.render('events/index', {
                    chunk : chunk,
                    message: req.flash('info'),
                    // total: parseInt(totalDocs),
                    // pageNo: pageNo
                })
           })
  })






//create new events

router.get("/create", isAuthenticated, (req, res) => {
  res.render("events/create", {
    errors: req.flash("errors"),
  });
});
// save event to db

router.post(
  "/create",
  [
    body("title")
      .isLength({ min: 5 })
      .withMessage("Title should be more than 5 char"),
    body("description")
      .isLength({ min: 5 })
      .withMessage("Description should be more than 5 char"),
    body("location")
      .isLength({ min: 3 })
      .withMessage("Location should be more than 5 char"),
    body("date").isLength({ min: 5 }).withMessage("Date should valid Date"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      req.flash("errors", errors.array());
      res.render("events/create",{errors:errors.array()});
      
    } else {
      let newEvent = new Event({
        title: req.body.title,
        description: req.body.description,
        date: req.body.date,
        location: req.body.location,
        created_at: Date.now(),
        userId: req.user.id
      });

      newEvent.save((err) => {
        if (!err) {
          req.flash("info", "Event has been added successful");

          res.redirect("/events");
        } else {
          console.log(err);
        }
      });
    }
  }
);

// show single event
router.get("/show/:id", (req, res) => {
  Event.findOne({ _id: req.params.id }, (err, event) => {
    if (!err) {
      // console.log(event);
      res.render("events/show", {
        event: event,
      });
    } else {
      console.log(err);
    }
  });
});

//Edit event
router.get("/edit/:id", (req, res) => {
  Event.findOne({ id: req.params.id }, (err, event) => {
    if (!err) {

      res.render("events/edit", {
        event,
        eventDate: moment(event.date).format("YYYY-MM-DD"),
        errors: req.flash("errors"),
        message: req.flash("info"),
      });
    } else {
      console.log(err);
    }
  });
});

//Edit event
router.post(
  "/update",
  [
    body("title")
      .isLength({ min: 5 })
      .withMessage("Title should be more than 5 char"),
    body("description")
      .isLength({ min: 5 })
      .withMessage("Description should be more than 5 char"),
    body("location")
      .isLength({ min: 3 })
      .withMessage("Location should be more than 5 char"),
    body("date").isLength({ min: 5 }).withMessage("Date should valid Date"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("errors", errors.array());
      res.redirect("/events/edit/" + req.body.id);
    } else {
        const newFields = {
            title:req.body.title,
            location:req.body.location,
            description:req.body.description,
            date:req.body.date,
        }

      Event.findOneAndUpdate({id:req.params.id}, newFields, function (err, docs) {
        if (!err) {
          
            req.flash('info', `You've been successfully redirected to the Message route!`)
            res.redirect("/events");
        } else {
          console.log("Updated User" )
        }
      });
    console.log();
    }
  }
);

router.get('/delete/:id', async(req,res)=>{
 try {
   await Event.findByIdAndDelete(req.params.id, (err, doc)=>{
      if (err) {
        console.log(err);
      }else{
        req.flash('info', `You've been successfully Deleted the event!`)
        res.redirect('/events',)
      }
    })
 } catch (error) {
   console.error(error)
 }
})

module.exports = router;
