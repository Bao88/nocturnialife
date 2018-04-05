// Source https://github.com/DDCSLearning/authenticationIntro
var express = require('express');
var router = express.Router();
var User = require('../models/user');
const Userplan = require("../models/userplan");

const request = require("request");


// GET route for reading data
router.get('/', function (req, res, next) {
  return res.sendFile('/views/index.html', {"root": "."});
  // if( typeof( req.session.userId ) === "undefined" ) return res.sendFile("views/login.html", {"root": "."}); 
  // else return res.sendFile('/views/index.html', {"root": "."});
});

router.get("/guest/", function (req, res, next) {
 return res.sendFile("views/guest.html", {"root": "."}); 
});

//POST route for either creating a new user or authenticate a user
router.post('/', function (req, res, next) {
  // confirm that user typed same password twice
  if (req.body.password !== req.body.passwordConf) {
    var err = new Error('Passwords do not match.');
    err.status = 400;
    res.send("passwords dont match");
    return next(err);
  }

  if (req.body.email &&
    req.body.username &&
    req.body.password &&
    req.body.passwordConf) {

    var userData = {
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
      passwordConf: req.body.passwordConf,
    }

    User.create(userData, function (error, user) {
      if (error) {
        return next(error);
      } else {
        req.session.userId = user._id;
        return res.redirect('/');
      }
    });

  } else if (req.body.logemail && req.body.logpassword) {
    User.authenticate(req.body.logemail, req.body.logpassword, function (error, user) {
      if (error || !user) {
        var err = new Error('Wrong email or password.');
        err.status = 401;
        return next(err);
      } else {
        req.session.userId = user._id;
        return res.redirect('/');
      }
    });
  } else {
    var err = new Error('All fields required.');
    err.status = 400;
    return next(err);
  }
})

router.post("/search", function ( req, res, next ) {
  let location = req.body.location;
  let currentDate = new Date().toISOString().split("T")[0].replace(/-/g, "");
  // console.log("testing");
  // console.log(req.body);
  
  request({
    url: "https://api.foursquare.com/v2/venues/explore",
    method: "GET",
    qs: {
      client_id: process.env.ClIENTID,
      client_secret: process.env.CLIENTSECRET,
      near: location,
      query: "bar",
      v: currentDate,
      limit: 10,
      venuePhotos: 1
    }
  }, function ( err, innerres, body ) {
    if(err){
      res.status(201);
      res.type("json").send({err: "Error requesting data from foursquare"});
    } else {
      console.log(JSON.parse(body).response);
      
      
      
      res.status(200);
      res.type("json").send(body);
    }
  });
    

});

// GET for logout 
router.get('/logout', function (req, res, next) {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

module.exports = router;