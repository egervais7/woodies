var express = require('express');
var request = require('request');
var $ = require('cheerio');

module.exports = {
  search: function(query, callback) {
    var woodObj;
    var woodArray = [];
    request('http://woodfloors.org/types.aspx', function(err, resp, html){
      if(!err && resp.statusCode === 200) {
        console.log('No Error, found HTML');
        var parsedHTML = $.load(html);
        parsedHTML('#column_middle').map(function(i, woodText) {
          var title = $(woodText).find('h2').text();
          var text = $(woodText).find('p').text();
          if (!title || !text) {
            return;
          }
          woodArray.push({title: title, text: text});
        });
        woodObj = {woods: woodArray};
        callback(woodObj);
      }
    });
  }
};
