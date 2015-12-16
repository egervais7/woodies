'use strict';
module.exports = function(sequelize, DataTypes) {
  var project = sequelize.define('project', {
    title: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.project.belongsTo(models.user);
      }
    }
  });
  return project;
};
