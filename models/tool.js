'use strict';
module.exports = function(sequelize, DataTypes) {
  var tool = sequelize.define('tool', {
    name: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.tool.belongsTo(models.user);
      }
    }
  });
  return tool;
};
