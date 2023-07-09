"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Schedules", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      runtime: {
        type: Sequelize.DATE,
      },
      message: {
        type: Sequelize.TEXT,
      },
      status: {
        type: Sequelize.ENUM("ACCEPTD", "DELIVRD", "UNDELIV", "UNKNOWN"),
        defaultValue: "UNKNOWN",
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.createTable("Recepients", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      phoneNumber: {
        type: Sequelize.STRING,
      },
      scheduleId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Schedules",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Schedules");
    await queryInterface.dropTable("Recepients");
  },
};
