const { addRecepient } = require("../service/serviceRecepient");
const { Recepient, Schedule } = require("../models");

describe("addRecepient", () => {
  let createRecepientMock;
  let createScheduleMock;
  let cbMock;

  beforeEach(() => {
    createRecepientMock = jest.spyOn(Recepient, "create");
    createScheduleMock = jest.spyOn(Schedule, "create");
    cbMock = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return error message if "phoneNumber" or "smsSchedulersId" is missing', async () => {
    const req = {
      body: {},
    };

    await addRecepient(req, cbMock);

    expect(cbMock).toHaveBeenCalledWith(
      "phoneNumber || smsSchedulersId body is missing!"
    );
  });

  it("should create a new recipient and a schedule, and return the created recipient", async () => {
    const phoneNumber = "123456789";
    const smsSchedulersId = 1;
    const createdRecipient = { id: 1, phoneNumber };

    createRecepientMock.mockResolvedValue(createdRecipient);

    const req = {
      body: {
        phoneNumber,
        smsSchedulersId,
      },
    };

    await addRecepient(req, cbMock);

    expect(createRecepientMock).toHaveBeenCalledWith({
      phoneNumber,
    });

    expect(createScheduleMock).toHaveBeenCalledWith({
      smsSchedulersId,
      recepientsId: createdRecipient?.id,
      isDelivered: 0,
      isAccepted: 0,
    });

    expect(cbMock).toHaveBeenCalledWith(null, createdRecipient);
  });

  it("should return error if an exception is thrown while creating the recipient", async () => {
    const error = new Error("Database error");
    createRecepientMock.mockRejectedValue(error);

    const req = {
      body: {
        phoneNumber: "123456789",
        smsSchedulersId: 1,
      },
    };

    await addRecepient(req, cbMock);

    expect(createRecepientMock).toHaveBeenCalled();
    expect(createScheduleMock).not.toHaveBeenCalled();
    expect(cbMock).toHaveBeenCalledWith(error);
  });

  it("should return error if an exception is thrown while creating the schedule", async () => {
    const error = new Error("Database error");
    createRecepientMock.mockResolvedValue({ id: 1, phoneNumber: "123456789" });
    createScheduleMock.mockRejectedValue(error);

    const req = {
      body: {
        phoneNumber: "123456789",
        smsSchedulersId: 1,
      },
    };

    await addRecepient(req, cbMock);

    expect(createRecepientMock).toHaveBeenCalled();
    expect(createScheduleMock).toHaveBeenCalled();
    expect(cbMock).toHaveBeenCalledWith(error);
  });
});
