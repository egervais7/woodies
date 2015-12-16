var express = require('express');
var router = express.Router();
var searchHelperPage = require('./toolsearch');


router.get('/', function(req, res){
  var search = req.body.search;
  searchHelperPage.woods(search, function(woods){
    res.render('index', woods);
  });
});

router.get('/restricted', function(req, res) {
  if(req.currentUser) {
    res.render('restricted');
  } else {
    req.flash('danger', 'You are not allowed to see this page');
    res.redirect('index');
  }
});

module.exports = router;
