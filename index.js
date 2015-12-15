var express = require('express');
var app = express();

var ejsLayouts = require('express-ejs-layouts');
var request = require('request');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var db = require('./models');

var searchPage = require('./controllers/search');
var toolsPage = require('./controllers/tools');
var projectPage = require('./controllers/projects');
var beginnerPage = require('./controllers/beginners');
var basicsPage = require('./controllers/basics');
var woodPage = require('./controllers/typesOfWood');

app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(flash());


//setting up the session
app.use(session({
  secret: 'woodies search',
  resave: false,
  saveUninitialized: true
}));

//custom middleware to go back one page
app.use(function(req, res, next){
  req.session.lastPage = req.header('Referer');
  res.locals.lastPage = req.session.lastPage;
  next();
});

//redner login page
app.get('/', function(req, res){
  var search = req.body.search;
  woodPage.search(search, function(woods){
    res.render('index', woods);
  });
});

app.get('/about', function(req, res){
  res.render('about');
});

app.get('/beginners', function(req, res){
  var search = req.body.search;
  beginnerPage.search(search, function(beginnerProjects){
    res.render('beginners', beginnerProjects);
  });
});

app.get('/basics', function(req, res){
  var search = req.body.search;
  basicsPage.search(search, function(basicSkills){
    res.render('basics', basicSkills);
  });
});





//set up controllers
app.use('/search', searchPage);
app.use('/projects', projectPage);
app.use('/tools', toolsPage);

app.listen(process.env.PORT || 3000);
