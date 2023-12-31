"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Recepient extends Model {
    static associate(models) {
      Recepient.belongsToMany(models.SmsScheduler, {
        through: models.Schedule,
        foreignKey: "recepientsId",
      });
    }
  }

  Recepient.init(
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      phoneNumber: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "Recepient",
      tableName: "Recepients",
      timestamps: true,
    }
  );

  return Recepient;
};
