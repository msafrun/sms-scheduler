const moment = require("moment/moment");
const { SmsScheduler, SchedulesHistories, Schedule } = require("../models");
const { Op } = require("sequelize");

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
    const { from, to, limit, page } = req.query;
    let opt = {
      where: {},
      offset: page ? page * (limit ? limit : 10) : 0,
      limit: limit ? limit : 10,
    };

    try {
      if ((from && !to) || from === "" || (to && !from) || to === "") {
        return cb("for range, please add from and to!");
      }

      if (from && to) {
        opt.where.createdAt = {
          [Op.between]: [from, to],
        };
      }

      const getData = await SmsScheduler.findAll(opt);

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

  getListSms: async (req, cb) => {
    const { from, to, limit, page, status } = req.query;
    let opt = {
      where: {},
      offset: page ? page * (limit ? limit : 10) : 0,
      limit: limit ? limit : 10,
      include: {},
    };
    try {
      if ((from && !to) || from === "" || (to && !from) || to === "") {
        return cb("for range, please add from and to!");
      }

      if (from && to) {
        opt.where.createdAt = {
          [Op.between]: [from, to],
        };
      }

      if (
        status &&
        !["ACCEPTD", "DELIVRD", "UNDELIV", "UNKNOWN"].includes(status)
      ) {
        return cb("status is not between ACCEPTD, DELIVRD, UNDELIV, UNKNOWN");
      }

      if (status) {
        opt.where.status = status;
      }

      opt.include = {
        model: Schedule,
        include: {
          model: SmsScheduler,
        },
      };

      const getData = await SchedulesHistories.findAll(opt);
      // console.log(getData);

      return cb(null, getData);
    } catch (error) {
      console.log(error);
      return cb(error);
    }
  },
};
