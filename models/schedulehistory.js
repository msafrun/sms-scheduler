"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SchedulesHistories extends Model {
    static associate(models) {
      SchedulesHistories.belongsTo(models.Schedule, {
        foreignKey: "schedulesId",
      });
    }
  }

  SchedulesHistories.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      schedulesId: {
        type: DataTypes.INTEGER,
      },
      messageId: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.ENUM("ACCEPTD", "DELIVRD", "UNDELIV", "UNKNOWN"),
      },
      time: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "SchedulesHistories",
      tableName: "SchedulesHistories",
      timestamps: true,
    }
  );

  return SchedulesHistories;
};
