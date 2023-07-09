const express = require("express");
const { addSchedule, getAllSchedule } = require("../service/serviceSchedule");
const router = express.Router();

router.post("/", async (req, res) => {
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

router.get("/", async (req, res) => {
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
