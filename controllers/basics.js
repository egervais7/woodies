var express = require('express');
var request = require('request');
var $ = require('cheerio');

module.exports = {
  search: function(query, callback) {
    var basicSkillsObj;
    var basicSkillsArray = [];
    request('http://www.makeuseof.com/tag/beginners-woodworking-5-skills-need-know/', function(err, resp, html){
      if(!err && resp.statusCode === 200) {
        console.log('No Error, found HTML');
        var parsedHTML = $.load(html);
        parsedHTML('.article_body').map(function(i, article) {
          var title = $(article).find('h2').text();
          var text = $(article).find('p').text();
          if (!title || !text) {
            return;
          }
          basicSkillsArray.push({title: title, text: text});
        });
        basicSkillsObj = {basicSkills: basicSkillsArray};
        callback(basicSkillsObj);
      }
    });
  }
};
