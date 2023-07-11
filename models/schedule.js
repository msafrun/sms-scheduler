"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Schedule extends Model {
    static associate(models) {
      Schedule.belongsTo(models.SmsScheduler, {
        foreignKey: "smsSchedulersId",
      });
      Schedule.belongsTo(models.Recepient, {
        foreignKey: "recepientsId",
      });
    }
  }

  Schedule.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      smsSchedulersId: {
        type: DataTypes.INTEGER,
      },
      recepientsId: {
        type: DataTypes.INTEGER,
      },
      isDelivered: {
        type: DataTypes.BOOLEAN,
      },
      isAccepted: {
        type: DataTypes.BOOLEAN,
      },
      messageId: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Schedule",
      tableName: "Schedules",
      timestamps: true,
    }
  );

  return Schedule;
};
