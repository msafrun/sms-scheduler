const moment = require("moment/moment");
const { Schedule } = require("../models");

module.exports = {
  addSchedule: async (req, cb) => {
    const { runtime, message, status } = req.body;
    try {
      if (!runtime || !message || !status) {
        return cb("runtime || message || status body is missing!");
      }

      const addNewSchedule = await Schedule.create({
        runtime,
        message,
        status,
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
      const getData = await Schedule.findAll({});

      //   console.log(getData);

      if (getData?.length > 0) {
        const formattedData = getData?.map((v) => {
          return {
            id: v.id,
            runtime: moment(v.runtime).format("YYYY-MM-DD HH:mm:ss"),
            message: v.message,
            status: v.status,
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
