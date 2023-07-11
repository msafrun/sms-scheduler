"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("SchedulesHistories", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      schedulesId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Schedules",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      messageId: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.ENUM("ACCEPTD", "DELIVRD", "UNDELIV", "UNKNOWN"),
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
    await queryInterface.dropTable("SchedulesHistories");
  },
};
