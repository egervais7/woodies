var express = require('express');
var db = require('./../models');
var request = require('request');
var $ = require('cheerio');
var router = express.Router();

router.get('/', function(req, res){
  db.tool.findAll().then(function(tools){
  res.render('tools', {tools: tools});
  });
  // var query = req.query.toolSearch;
  // request('http://www.homedepot.com/s/' + query, function(error, response, body){
  //   debugger;
  //   var data = JSON.parse(body);
  //   console.log(data);
  //   if(!error && response.statusCode === 200 && data.Search) {
  //     res.render('tools', {tools: data.Search, toolSearch: query});
  //   }
  // });
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

// module.exports = {
//   search : function(query, callback) {
//     var toolsObj;
//     var toolsArray = [];
//     request("http://www.homedepot.com/s/" + query.toLowerCase(), function(err, resp, html){
//         if(!err && resp.statusCode === 200) {
//           console.log('No Error, found HTML');
//           var parsedHTML = $.load(html);
//           console.log(parsedHTML);
//           parsed('.col-1-4').map(function(i, tool) {
//             var text = $(tool).find('.product-image').attr('alt');
//             var link = $(tool).find('.product-image').attr('href');
//             var image = $(tool).find('.product-image').attr('src');
//             if( !text || !link || !image){
//               return;
//           }
//           toolsArray.push({
//             title: text,
//             link: link,
//             image: image
//           });
//           toolsObj = {tools: toolsArray};
//           callback(toolsObj);
//         });
//       }
//     });
//   }
// };
