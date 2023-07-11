const { default: axios } = require("axios");
const {
  Recepient,
  SmsScheduler,
  Schedule,
  SchedulesHistories,
} = require("../../models");
const { Op } = require("sequelize");

const api_url = process.env.BASE_URL;

module.exports = {
  runTimeSmsScheduler: async () => {
    try {
      // get sms runtime TODO: dynamic
      const getAllSmsScheduler = await SmsScheduler.findOne({
        where: {
          id: 1,
        },
      });

      if (getAllSmsScheduler) {
        // check conjuction table
        const getAllSchedule = await Schedule.findAll({
          where: {
            smsSchedulersId: getAllSmsScheduler.id,
            recepientsId: {
              [Op.gt]: 0,
            },
          },
          include: {
            model: Recepient,
            attributes: ["id", "phoneNumber"],
          },
        });

        //   console.log(
        //     "getAllSchedule <<<<<",
        //     getAllSchedule[0].Recepient.phoneNumber
        //   );

        // if found
        if (getAllSchedule.length > 0) {
          const formattedToString = getAllSchedule
            .map((v) => v.Recepient.phoneNumber)
            .join(",");

          const { data } = await axios({
            method: "POST",
            url: api_url,
            data: {
              dnis: formattedToString,
              message: getAllSmsScheduler.message,
            },
          });

          // checker due to api has different response depending on dnis body, then update schedule
          if (Array.isArray(data)) {
            //   console.log("iya ini array <<<<<<<", data);
            for (let i = 0; i < data.length; i++) {
              const elAPI = data[i];
              const elSchedule = getAllSchedule[i];

              if (elAPI.dnis === elSchedule.Recepient.phoneNumber) {
                await Schedule.update(
                  {
                    messageId: elAPI.message_id,
                  },
                  {
                    where: {
                      smsSchedulersId: getAllSmsScheduler.id,
                      recepientsId: elSchedule.Recepient.id,
                    },
                  }
                );
              }
            }
            // loops end here
          } else {
            const findData = getAllSchedule.find(
              (v) => v.Recepient.phoneNumber === data.dnis
            );

            if (findData) {
              await Schedule.update(
                {
                  messageId: data.message_id,
                },
                {
                  where: {
                    smsSchedulersId: getAllSmsScheduler.id,
                    recepientsId: getAllSchedule[0].Recepient.id,
                  },
                }
              );
            }
          }
        } else {
          // if not found then insert (used for first time)
          const getAllRecepient = await Recepient.findAll({});

          // console.log("getAllRecepient <<<<<", getAllRecepient);

          if (getAllRecepient.length > 0) {
            let arrInsertData = [];
            for (let i = 0; i < getAllRecepient.length; i++) {
              const elRecepient = getAllRecepient[i];
              arrInsertData.push({
                smsSchedulersId: getAllSmsScheduler.id,
                recepientsId: elRecepient.id,
                isDelivered: false,
                isAccepted: false,
              });
            }

            if (arrInsertData.length > 0) {
              // await Schedule.bulkCreate(arrInsertData);
              console.log("data inserted!");
            }
          } else {
            console.log("nothing to be executed!");
          }
        }
      }

      return "runTimeSmsScheduler done!";
    } catch (error) {
      console.log("<<<<<<< error runTimeSmsScheduler", error);
    }
  },

  smsSchedulerProcessor: async () => {
    try {
      // get not delivered and is accepted status to be processed TODO: dynamic
      const getAllSchedule = await Schedule.findAll({
        where: {
          [Op.or]: [{ isDelivered: false }, { isAccepted: true }],
        },
        include: [
          {
            model: Recepient,
            attributes: ["id", "phoneNumber"],
          },
          {
            model: SmsScheduler,
            attributes: ["id", "message"],
          },
        ],
      });

      //   console.log(getAllSchedule.length);

      //   return "here";

      if (getAllSchedule.length > 0) {
        for (let i = 0; i < getAllSchedule.length; i++) {
          const elGetAllSchedule = getAllSchedule[i];

          // if status is not delivered and not accepted
          if (!elGetAllSchedule.isDelivered && !elGetAllSchedule.isAccepted) {
            const { data } = await axios({
              method: "POST",
              url: api_url,
              data: {
                dnis: elGetAllSchedule.Recepient.phoneNumber,
                message: elGetAllSchedule.SmsScheduler.message,
              },
            });

            if (data) {
              await Schedule.update(
                {
                  messageId: data.message_id,
                },
                {
                  where: {
                    recepientsId: elGetAllSchedule.Recepient.id,
                    smsSchedulersId: elGetAllSchedule.SmsScheduler.id,
                  },
                }
              );

              const getStatusApi = await axios({
                method: "GET",
                url: api_url + `?messageId=${data.message_id}`,
              });

              if (getStatusApi.data.status === "DELIVRD") {
                await Schedule.update(
                  {
                    isDelivered: true,
                    isAccepted: false,
                  },
                  {
                    where: {
                      recepientsId: elGetAllSchedule.Recepient.id,
                      smsSchedulersId: elGetAllSchedule.SmsScheduler.id,
                    },
                  }
                );
              }

              await SchedulesHistories.create({
                schedulesId: elGetAllSchedule.id,
                messageId: data.message_id,
                status: getStatusApi.data.status,
                time: getStatusApi.data.delivery_time,
              });
            }
          }

          // if status is accepted
          if (elGetAllSchedule.isAccepted) {
            const getStatusApi = await axios({
              method: "GET",
              url: api_url + `?messageId=${getAllSchedule[i].messageId}`,
            });

            if (
              getStatusApi.data.status !== "ACCEPTD" &&
              getStatusApi.data.status !== "DELIVRD"
            ) {
              await Schedule.update(
                {
                  isDelivered: false,
                  isAccepted: false,
                },
                {
                  where: {
                    messageId: getAllSchedule[i].messageId,
                  },
                }
              );
            }

            if (getStatusApi.data.status === "DELIVRD") {
              await Schedule.update(
                {
                  isDelivered: true,
                  isAccepted: false,
                },
                {
                  where: {
                    messageId: getAllSchedule[i].messageId,
                  },
                }
              );
            }

            await SchedulesHistories.create({
              schedulesId: elGetAllSchedule.id,
              messageId: getAllSchedule[i].messageId,
              status: getStatusApi.data.status,
              time: getStatusApi.data.delivery_time,
            });
          }
        }
      }

      return "smsSchedulerProcessor done!";
    } catch (error) {
      console.log("<<<<<<< error smsSchedulerProcessor", error);
    }
  },
};
