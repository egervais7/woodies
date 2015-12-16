var express = require('express');
var $ = require('cheerio');
var request = require('request');

module.exports = {
  homeDepot : function(query, callback) {
      var toolsObj;
      var toolsArray = [];
      request("http://www.homedepot.com/s/" + query, function(err, resp, html){
        if(!err && resp.statusCode === 200) {
          var parsedHTML = $.load(html);
          parsedHTML('.product-image').map(function(i, tool) {
            var text = $(tool).find('.stretchy').attr('alt');
            var link = $(tool).find('.product-image > a').attr('href');
            var image = $(tool).find('.stretchy').attr('src');
            if( !text || !link || !image){
              return;
            }
            toolsArray.push({ title: text, link: link, image: image});
          });
          toolsObj = {hdTools: toolsArray};
          callback(toolsObj);
        }
      });
    },
  topTools : function(query, callback) {
      var topToolObj;
      var topToolArray = [];
      request("http://www.startwoodworking.com/lists/12-basic-hand-tools-woodworking", function(err, resp, html){
        if(!err && resp.statusCode === 200) {
          console.log('No Error, found HTML');
          var parsedHTML = $.load(html);
          parsedHTML('.list-item').map(function(i, tool){
            var title = $(tool).find('strong').text();
            var image = $(tool).find('.imagecache').attr('src');
            if(!title || !image) {
              return;
            }
            topToolArray.push({title: title, image: image});
          });
          topToolObj = {basicTools : topToolArray};
          callback(topToolObj);
        }
      });
    },
  starters : function(query, callback) {
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
  },
  skills : function(query, callback) {
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
          basicSkillsArray.push({ titles: title, texts: text});
        });
        basicSkillsObj = {basicSkills: basicSkillsArray};
        callback(basicSkillsObj);
      }
    });
  },
  woods : function(query, callback) {
    var woodObj;
    var woodArray = [];
    request('http://www.wood-database.com/wood-articles/wood-identification-guide/', function(err, resp, html){
      if(!err && resp.statusCode === 200) {
        console.log('No Error, found HTML');
        var parsedHTML = $.load(html);
        parsedHTML('.wp-caption').map(function(i, woodText) {
          //var title = $(woodText).find('strong').text();
          var image = $(woodText).find('.size-large').attr('src');
          var text = $(woodText).find('.wp-caption-text').text();
          if (!image || !text) {
            return;
          }
          woodArray.push({image: image, text: text});
        });
        woodObj = {woods: woodArray};
        callback(woodObj);
      }
    });
  }
};
