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

//POST Creating a new poll and store it in database
router.post('/search', function (req, res, next) {
  var user; 
  console.log(req.body);
  res.status(200);
  res.type("json").send({ok:"ok"});
  // User.findById(req.session.userId).exec(function (error, user) {
  //   if (error) return next(error);
  //   else {
  //     //create the data
  //     console.log(req.body[1]);
  //     user = user.username;
  //     var array = [];
  //     for(var i = 0; i < req.body[1].length;i++) array[i] = 0;
  //     var pollData = {
  //       username: user,
  //       poll: req.body,
  //       votes: array,
  //       voted: []
  //     };
      
  //     // store the data in database       
  //     Poll.create(pollData, function (error, user) {
  //       if (error) {
  //         console.log(error);
  //         return next(error);
  //       } else {
  //         // req.session.userId = user._id;
  //         return res.redirect('/');
  //       }
  //     });
  //   }
  // });
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