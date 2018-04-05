// Learning from https://medium.com/of-all-things-tech-progress/starting-with-authentication-a-tutorial-with-node-js-and-mongodb-25d524ca0359
var express = require('express'), 
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    session = require("express-session"),
    MongoStore = require("connect-mongo")(session);

// connect to MongoDB
mongoose.connect(process.env.MONGODB);
var db = mongoose.connection;

// Get Mongoose to use the global promise library
mongoose.Promise = global.Promise;

// Testing connection with MongoDB
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
 console.log("Connected"); 
});


app.use(session({
  secret: "work hard",
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));


// Parsing of incoming requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static files from views folder
app.use(express.static('public'));

// Routing
var routes = require("./routes/router.js");
app.use("/", routes);


// Catch errors and forward them to handlers
app.use(function (req, res, next){
  var err = new Error("File Not Found"); 
  err.status = 404;
  next(err);
});
        
// Error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
