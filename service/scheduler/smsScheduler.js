const { default: axios } = require("axios");
const { Recepient, SmsScheduler, Schedule } = require("../../models");
const { Op } = require("sequelize");

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
            url: "http://kr8tif.lawaapp.com:1338/api",
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

      return "done!";
    } catch (error) {
      console.log("<<<<<<< error runTimeSmsScheduler", error);
    }
  },

  smsSchedulerProcessor: async () => {
    try {
    } catch (error) {
      console.log("<<<<<<< error smsSchedulerProcessor", error);
    }
  },
};
