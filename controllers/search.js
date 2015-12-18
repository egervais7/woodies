var express = require('express');
var request = require('request');
var db = require('../models');
var searchHelperPage = require('./toolsearch');

var router = express.Router();

//render the search page
router.get('/', function(req, res){
  res.render('search', {pins: null});
});

//use pinterest api to search for pin in user pins
router.post('/', function(req, res){
  var userQuery = req.body.q;
  request("https://api.pinterest.com/v1/me/search/pins/?query=" + userQuery + "&access_token=AdsOOLtiDaYOU8JLrKbHk57-DSyhFCCLXy9yEsNCtz3HPMBGzgAAAAA&fields=id%2Clink%2Cnote%2Curl%2Cimage", function(err, resp, body){
    var data = JSON.parse(body);
    console.log(data);
    if (!err && resp.statusCode == 200) {
      res.render('search', {pins: data});}
  });
});

//was for scrapping pinterest, but pinterest does not allow this and sends back the same information no matter what the search is

// router.post('/', function(req, res){
//   var search = req.body.search;
//   searchHelperPage.pinterest(search, function(pins){
//     res.render('search', pins);
//   });
// });

module.exports = router;
