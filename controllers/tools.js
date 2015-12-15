var express = require('express');
var db = require('./../models');
var router = express.Router();

router.get('/', function(req, res){
  db.tool.findAll().then(function(tools){
  res.render('tools', {tools: tools});
  });
});

router.post('/', function(req, res){
  var newTool = {
    name: req.body.toolName
  };
  db.tool.create(newTool).then(function(){
  res.redirect('tools');
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
