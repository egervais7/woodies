var express = require('express');
var db = require('./../models');
var searchHelperPage = require('./toolsearch');

var router = express.Router();

// find user tools and populate table if user has tools
router.get('/', function(req, res){
  var id = res.locals.currentUser.id;
  db.user.findById(id).then(function(user){
    user.getTools().then(function(tools){
      res.render('tools', { hdTools: null, tools: tools, user: user});
    });
  });
});

// post data scrape from Home Depot to search for tools
router.post('/', function(req, res){
  var search = req.body.search;
  searchHelperPage.homeDepot(search, function(hdTools){
    res.render('tools', { hdTools: hdTools, tools: false });
  });
});

//add new tool to user tools
router.post('/userTools', function(req, res){
  console.log(res.locals.currentUser.id);
  var newTool = {
    name: req.body.name,
    image: req.body.image,
    link: req.body.link,
    userId: res.locals.currentUser.id
  };
  db.tool.create(newTool).then(function(success){
    res.redirect('/tools');
  });
});

//destroy tool from user tools
router.delete('/:id', function(req, res){
  console.log(req.params.id);
  db.tool.destroy({
    where: {
      id: req.params.id
    }
  }).then(function(){
    res.send('success');
  });
});

module.exports = router;
