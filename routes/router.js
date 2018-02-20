// Source https://github.com/DDCSLearning/authenticationIntro
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Poll = require("../models/poll");

// GET route for reading data
router.get('/', function (req, res, next) {
  return res.sendFile('/views/index.html', {"root": "."});
  // if( typeof( req.session.userId ) === "undefined" ) return res.sendFile("views/login.html", {"root": "."}); 
  // else return res.sendFile('/views/index.html', {"root": "."});
});

router.get("/guest/", function (req, res, next) {
 return res.sendFile("views/guest.html", {"root": "."}); 
});

//POST route for updating data
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

router.post("/mypoll", function ( req, res, next ) {
  // Poll.findByName(
  var user; 
  // console.log(req.body);
  // console.log("inside");
  Poll.find({ username: req.body.name }).exec(function ( error, obj ) {
    if (error) return next(error);
    else {
      // console.log(obj[0].poll);
      res.type("json").send(obj);
    }
  });
});

router.get("/allpolls", function ( req, res, next ) {
  // console.log(req);
  Poll.find().exec(function ( error, obj ) {
    if (error) return next(error);
    else {
      // console.log(obj[0].poll);
      res.type("json").send(obj);
    }
  });
});

//POST Creating a new poll and store it in database
router.post('/create', function (req, res, next) {
  var user; 
  
  User.findById(req.session.userId).exec(function (error, user) {
    if (error) return next(error);
    else {
      //create the data
      console.log(req.body[1]);
      user = user.username;
      var array = [];
      for(var i = 0; i < req.body[1].length;i++) array[i] = 0;
      var pollData = {
        username: user,
        poll: req.body,
        votes: array,
        voted: []
      };
      
      // store the data in database       
      Poll.create(pollData, function (error, user) {
        if (error) {
          console.log(error);
          return next(error);
        } else {
          // req.session.userId = user._id;
          return res.redirect('/');
        }
      });
    }
  });
});

router.post('/getmypolls', function (req, res, next) {
  var user; 
  // console.log(req.body);
  console.log(req.session.userId);
  
  User.findById(req.session.userId).exec(function (error, user) {
    if (error) return next(error);
    else {
      user = user.username;
     
      
      res.redirect('/');
    }
  });
});

router.post('/getallpolls', function (req, res, next) {
  var user; 
  // console.log(req.body);
  console.log(req.session.userId);
  
});

router.get("/who", function ( req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          return res.type("json").send({ name: "Guest"});
        } else {
          var obj = {name: user.username};
          return res.type("json").send(obj);
        }
      }
    });
});

// GET route after registering
router.get('/profile', function (req, res, next) {
  User.findById(req.session.userId)
    .exec(function (error, user) {
      if (error) {
        return next(error);
      } else {
        if (user === null) {
          var err = new Error('Not authorized! Go back!');
          err.status = 400;
          return next(err);
        } else {
          return res.send('<h1>Name: </h1>' + user.username + '<h2>Mail: </h2>' + user.email + '<br><a type="button" href="/logout">Logout</a>')
        }
      }
    });
});

router.get("/poll/*", function ( req, res, next ) {
  var pollID = req.url.slice(6);
  // console.log(req.url);
  // console.log(pollID);
  Poll.findById(pollID).exec( function ( error, obj ) {
    if( error ) return next(error);
    else {
      var header = `<head>
                        <title>VoteNex - A Voting App - Poll.</title> 
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                        <meta name="keywords" content="Intro information" />

                        <link id="favicon" rel="icon" href="https://cdn.glitch.com/38e0359d-17f9-4e45-a1e2-f1dd5b87172e%2FVoteNexLogoTransperancyBIG2.png?1518171358033" type="image/x-icon">

                        <link href="/css/user.css" rel="stylesheet" type="text/css">
                        <link href="/css/poll.css" rel="stylesheet" type="text/css">
                        <link href="https://fonts.googleapis.com/css?family=Courgette" rel="stylesheet">
                        <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
                        <script src="/scripts/poll.js"></script>
                    </head>
                    <header class="header">
                     <a id="home" href="/"> </a>
                      <div id="title">Welcome, <span id="display-name">`+ obj.username+`</span>!</div>
                    
                    </header>
                    
                    <div class="intro-container">
                        <a href="/logout"><button type="button" class="btn logout" >Logout</button></a>
                    </div>
                    <div id="object" style="display: none;">`+JSON.stringify(obj)+`</div>
                    <div class="container">
                      <div id="poll" class="poll-container"></div>
                      <div id="chart" class="poll-container"></div>
                    </div>
                    `;
      res.status(301);
      return res.send(header);
    }
  });
});

router.post("/modifypoll", function ( req, res , next ){
  Poll.findByIdAndUpdate({_id :req.body.id, votes: req.body.index}, {$push: {
    votes: {
      $each: [],
      $slice: req.body.options.length
  }}, poll: [req.body.question, req.body.options]} , { new: true}).exec(function ( err, data ){
    if (err) return next(err);
      res.status(200);
      res.type("json").send(data);
    });  
});

router.post("/updatepoll", function ( req, res , next ){
  var update = {$inc: {}}; 
  update.$inc['votes.' + req.body.index] = 1;
  Poll.findByIdAndUpdate({_id :req.body.id, votes: req.body.index}, update , { new: true}).exec(function ( err, data ){
    if (err) res.status(201).type("json").send({});
      res.status(200);
      res.type("json").send(data);
    });  
});

router.post("/removepoll", function ( req, res , next ){

  Poll.findByIdAndRemove({_id :req.body.id}).exec(function ( err, data ){
    if (err) res.status(201).type("json").send({});
      // console.log(data.votes);
      res.status(200);
      res.type("json").send({status: "poll is removed"});
    });  
});

// GET for logout logout
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