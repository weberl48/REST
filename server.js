//Calling Packages
var express = require('express');
var app = express(); // define the app using express
var bodyParser = require('body-parser')
var morgan = require('morgan');
var mongoose = require('mongoose');
var port = process.env.PORT || 8080;

var User = require('./app/models/user');
//database connection
mongoose.connect('mongodb://node:noder@novus.modulusmongo.net:27017/Iganiq8o')
  // App Configuration
  //use body parser to grab info from POST requests
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// configure app to handle CORS requests
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, \
    Authorization');
  next();
});
// log all requests to the console
app.use(morgan('dev'));

//Routes for API

//home page Routes
app.get('/', function(req, res) {
  res.send('Welcome to the home page');
})

//get an instance of the express router
var apiRouter = express.Router();
//middleware to use for all requests
apiRouter.use(function(req, res, next) {
  console.log('Somebody Came To Ma APP!!!!!!!!!!!!');
  next();
});
//test route
// http://localhost:8080/api
apiRouter.get('/', function(req, res) {
  res.json({
    message: ' api hit!'
  });
});
//on routes that end in /users
apiRouter.route('/users')
  //create a user(api/users)
  .post(function(req, res) {
    //create new instance of the User model
    var user = new User();
    // set the users informaiton (comes from request)
    user.name = req.body.name;
    user.username = req.body.username;
    user.password = req.body.password;
    // save the user and check for errors
    user.save(function(err) {
      if (err) {
        // duplicate entry
        if (err.code == 11000) {
          return res.json({
            success: false,
            message: 'A user with that usernmae alread exixts.'
          });
        } else {
          console.log("ADDASD!!!@!@!@!@!@!@!");
          return res.send(err);
        }
      }
      res.json({
        message: 'User created!'
      });
    });
  })
  //get all the users
  .get(function(req, res){
    User.find(function(err,users){
      if (err) res.send(err);
      //return the users
      res.json(users);
    });
  })
  //RESGISTER Routes
  // app routes prefixed with /api
app.use('/api', apiRouter);
//START server
app.listen(port);
console.log('server started on' + port);
