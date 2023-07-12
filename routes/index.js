const express = require("express");
const {
  addSchedule,
  getAllSchedule,
} = require("../service/serviceSmsScheduler");
const { addRecepient } = require("../service/serviceRecepient");
const router = express.Router();

router.post("/schedule", async (req, res) => {
  await addSchedule(req, (error, result) => {
    if (error) {
      res.status(400).send({
        status: 400,
        message: error,
      });
    } else {
      res.status(200).send({
        status: 200,
        result,
      });
    }
  });
});

router.post("/recepient", async (req, res) => {
  await addRecepient(req, (error, result) => {
    if (error) {
      res.status(400).send({
        status: 400,
        message: error,
      });
    } else {
      res.status(200).send({
        status: 200,
        result,
      });
    }
  });
});

router.get("/schedule", async (req, res) => {
  await getAllSchedule(req, (error, result) => {
    if (error) {
      res.status(400).send({
        status: 400,
        message: error,
      });
    } else {
      res.status(200).send({
        status: 200,
        result,
      });
    }
  });
});

module.exports = {
  scheduleRouter: router,
};
