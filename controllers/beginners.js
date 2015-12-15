var express = require('express');
var request = require('request');
var $ = require('cheerio');

module.exports = {
  search: function(query, callback) {
    var beginnerProjectsObj;
    var beginnerProjectsArray = [];
    request('http://www.instructables.com/id/Woodworking-Projects-for-Beginners/', function(err, resp, html){
      if(!err && resp.statusCode === 200) {
        console.log('No Error, found HTML');
        var parsedHTML = $.load(html);
        parsedHTML('.ible-thumb').map(function(i, projectBegin) {
          var image = $(projectBegin).find('.ible-image').attr('src');
          var title = $(projectBegin).find('.ible-image').attr('alt');
          var link = $(projectBegin).find('a').attr('href');
          if (!image || !title || !link) {
            return;
          }
          beginnerProjectsArray.push({title: title, image: image, link: link});
        });
        beginnerProjectsObj = {beginnerProjects: beginnerProjectsArray};
        callback(beginnerProjectsObj);
      }
    });
  }
};
