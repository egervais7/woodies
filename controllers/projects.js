var express = require('express');
var db = require('./../models');
var router = express.Router();

router.get('/', function(req, res){
  db.project.findAll().then(function(projects){
    res.render('projects', {projects: projects});
  });
});

router.post('/', function(req, res){
  var newProj = {
    name : req.body.projName
  };
  db.project.create(newProj).then(function(){
    res.redirect('projects');
  });
});

module.exports = router;
