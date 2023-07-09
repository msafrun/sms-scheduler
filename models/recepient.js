"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Recepient extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Recepient.belongsTo(models.Schedule);
    }
  }
  Recepient.init(
    {
      phoneNumber: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Recepient",
    }
  );
  return Recepient;
};
