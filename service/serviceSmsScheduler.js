const moment = require("moment/moment");
const { SmsScheduler } = require("../models");

module.exports = {
  addSchedule: async (req, cb) => {
    const { runtime, message } = req.body;
    try {
      if (!runtime || !message) {
        return cb("runtime || message body is missing!");
      }

      const addNewSchedule = await SmsScheduler.create({
        runtime,
        message,
      });

      if (addNewSchedule) {
        return cb(null, addNewSchedule);
      }
    } catch (error) {
      return cb(error);
    }
  },

  getAllSchedule: async (req, cb) => {
    try {
      const getData = await SmsScheduler.findAll({});

      //   console.log(getData);

      if (getData?.length > 0) {
        const formattedData = getData?.map((v) => {
          return {
            id: v.id,
            runtime: moment(v.runtime).format("YYYY-MM-DD HH:mm:ss"),
            message: v.message,
            createdAt: v.createdAt,
            updatedAt: v.updatedAt,
          };
        });

        return cb(null, formattedData);
      }

      return cb(null, getData);
    } catch (error) {
      return cb(error);
    }
  },
};
