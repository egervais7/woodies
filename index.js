//set up app
var express = require('express');
var app = express();

//set up for using https, required by pinterest
var http = require('http');
var https = require('https');
var fs = require('fs');
var privateKey  = fs.readFileSync('key.pem', 'utf8');
var certificate = fs.readFileSync('cert.pem', 'utf8');
var credentials = {key: privateKey, cert: certificate};

//requiring npm modules
var ejsLayouts = require('express-ejs-layouts');
var request = require('request');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt');
var session = require('express-session');
var strategies = require('./config/strategies');
var passport = require('passport');
var flash = require('connect-flash');

//require database tables
var db = require('./models');

//require controllers
var searchPage = require('./controllers/search');
var toolsPage = require('./controllers/tools');
var authPage = require('./controllers/auth');

//search helper page
var searchHelperPage = require('./controllers/toolsearch');

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

app.use(function(req, res, next){
  if(req.session.user) {
    db.user.findById(req.session.user).then(function(user){
      req.currentUser = user;
      next();
    });
  } else {
    req.currentUser = false;
    next();
  }
});

//used for authenticating pinterest login
app.use(passport.initialize());
app.use(passport.session());

passport.use(strategies.localStrategy);
passport.use(strategies.pinterestStrategy);

passport.serializeUser(strategies.serializeUser);
passport.deserializeUser(strategies.deserializeUser);

//setting up using alerts with flash
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.alerts = req.flash();
  next();
});

// render index page
app.get('/', function(req, res){
  var search = req.body.search;
  searchHelperPage.woods(search, function(woods){
    res.render('index', woods);
  });
});

// render about page
app.get('/about', function(req, res){
  res.render('about');
});

//render beginners page with scraped article
app.get('/beginners', function(req, res){
  var search = req.body.search;
  searchHelperPage.starters(search, function(beginnerProjects){
    res.render('beginners', beginnerProjects);
  });
});

//render basics page with scrapped article
app.get('/basics', function(req, res){
  var search = req.body.search;
  searchHelperPage.skills(search, function(basicSkills){
    res.render('basics', basicSkills);
  });
});

//render tool search page for user to data scrape from home depot for tools
app.get('/toolsearch', function(req, res){
  var search = req.body.search;
  searchHelperPage.topTools(search, function(basicTools){
    res.render('toolSearch', basicTools);
  });
});

//set up controllers
app.use('/search', searchPage);
app.use('/tools', toolsPage);
app.use('/auth', authPage);

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(process.env.PORT || 3000);
httpsServer.listen(process.env.SSLPORT || 4000);
