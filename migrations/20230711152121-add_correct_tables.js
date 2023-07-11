"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("SmsSchedulers", {
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
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
      },
    });

    await queryInterface.createTable("Schedules", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      smsSchedulersId: {
        type: Sequelize.INTEGER,
        references: {
          model: "SmsSchedulers",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      recepientsId: {
        type: Sequelize.INTEGER,
        references: {
          model: "Recepients",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      isDelivered: {
        type: Sequelize.BOOLEAN,
      },
      isAccepted: {
        type: Sequelize.BOOLEAN,
      },
      messageId: {
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("SmsSchedulers");
    await queryInterface.dropTable("Recepients");
    await queryInterface.dropTable("Schedules");
  },
};
