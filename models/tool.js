'use strict';
module.exports = function(sequelize, DataTypes) {
  var tool = sequelize.define('tool', {
    name: DataTypes.STRING,
    own: DataTypes.STRING,
    want: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return tool;
};