var express = require('express');
var db = require('./../models');
var searchHelperPage = require('./toolsearch');

var router = express.Router();

router.get('/', function(req, res){
  // db.user.findById()
  res.render('tools', {hdTools: null});
});

router.post('/', function(req, res){
  var search = req.body.search;
  searchHelperPage.homeDepot(search, function(hdTools){
    res.render('tools', hdTools);
  });
});

router.post('/userTools', function(req, res){
  var newTool = {
    name: req.body.name
  };
  db.tool.create(newTool).then(function(){
  res.redirect('/tools');
  });
});

router.delete('/:id', function(req, res){
  db.tool.destroy({
    where: {
      id: req.params.id
    }
  }).then(function(){
    res.send('success');
  });
});

module.exports = router;
