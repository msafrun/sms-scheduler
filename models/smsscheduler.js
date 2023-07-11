"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SmsScheduler extends Model {
    static associate(models) {
      SmsScheduler.belongsToMany(models.Recepient, {
        through: models.Schedule,
        foreignKey: "smsSchedulersId",
      });
    }
  }

  SmsScheduler.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      runtime: {
        type: DataTypes.DATE,
      },
      message: {
        type: DataTypes.TEXT,
      },
    },
    {
      sequelize,
      modelName: "SmsScheduler",
      tableName: "SmsSchedulers",
      timestamps: true,
    }
  );

  return SmsScheduler;
};
