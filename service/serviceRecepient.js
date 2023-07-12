const { Recepient, Schedule } = require("../models");

module.exports = {
  addRecepient: async (req, cb) => {
    const { phoneNumber, smsSchedulersId } = req.body;
    try {
      if (!phoneNumber || !smsSchedulersId) {
        return cb("phoneNumber || smsSchedulersId body is missing!");
      }

      const addNewRecepient = await Recepient.create({
        phoneNumber,
      });

      if (addNewRecepient) {
        await Schedule.create({
          smsSchedulersId,
          recepientsId: addNewRecepient?.id,
          isDelivered: 0,
          isAccepted: 0,
        });
        return cb(null, addNewRecepient);
      }
    } catch (error) {
      return cb(error);
    }
  },
};
