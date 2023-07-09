"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Schedule.hasMany(models.Recepient);
    }
  }
  Schedule.init(
    {
      runtime: DataTypes.DATE,
      message: DataTypes.TEXT,
      status: DataTypes.ENUM("ACCEPTD", "DELIVRD", "UNDELIV", "UNKNOWN"),
    },
    {
      sequelize,
      modelName: "Schedule",
    }
  );
  return Schedule;
};
