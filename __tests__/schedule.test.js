const moment = require("moment");
const { Op } = require("sequelize");
const { SmsScheduler, SchedulesHistories, Schedule } = require("../models");
const {
  getAllSchedule,
  getListSms,
  addSchedule,
} = require("../service/serviceSmsScheduler");

describe("getAllSchedule", () => {
  let findAllMock;
  let cbMock;

  beforeEach(() => {
    findAllMock = jest.spyOn(SmsScheduler, "findAll");
    cbMock = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should return error message if "from" or "to" is missing', async () => {
    const req = {
      query: {
        from: "",
        to: "",
      },
    };

    await getAllSchedule(req, cbMock);

    expect(cbMock).toHaveBeenCalledWith("for range, please add from and to!");
  });

  test("should return data within the specified range", async () => {
    const from = "2023-01-01";
    const to = "2023-01-31";

    const getData = [
      {
        id: 1,
        runtime: moment("2023-01-15").format("YYYY-MM-DD HH:mm:ss"),
        message: "Test message 1",
        createdAt: moment("2023-01-10").format("YYYY-MM-DD HH:mm:ss"),
        updatedAt: moment("2023-01-10").format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        id: 2,
        runtime: moment("2023-01-20").format("YYYY-MM-DD HH:mm:ss"),
        message: "Test message 2",
        createdAt: moment("2023-01-12").format("YYYY-MM-DD HH:mm:ss"),
        updatedAt: moment("2023-01-12").format("YYYY-MM-DD HH:mm:ss"),
      },
    ];

    findAllMock.mockResolvedValue(getData);

    const req = {
      query: {
        from,
        to,
      },
    };

    await getAllSchedule(req, cbMock);

    const formattedData = getData.map((v) => ({
      id: v.id,
      runtime: moment(v.runtime).format("YYYY-MM-DD HH:mm:ss"),
      message: v.message,
      createdAt: v.createdAt,
      updatedAt: v.updatedAt,
    }));

    expect(findAllMock).toHaveBeenCalledWith({
      where: {
        createdAt: {
          [Op.between]: [from, to],
        },
      },
      offset: 0,
      limit: 10,
    });
    expect(cbMock).toHaveBeenCalledWith(null, formattedData);
  });

  test("should return empty array if no data found within the specified range", async () => {
    const from = "2023-01-01";
    const to = "2023-01-31";

    findAllMock.mockResolvedValue([]);

    const req = {
      query: {
        from,
        to,
      },
    };

    await getAllSchedule(req, cbMock);

    expect(findAllMock).toHaveBeenCalledWith({
      where: {
        createdAt: {
          [Op.between]: [from, to],
        },
      },
      offset: 0,
      limit: 10,
    });
    expect(cbMock).toHaveBeenCalledWith(null, []);
  });

  test('should return data without filtering if "from" and "to" are not provided', async () => {
    const getData = [
      {
        id: 1,
        runtime: moment("2023-01-15").format("YYYY-MM-DD HH:mm:ss"),
        message: "Test message 1",
        createdAt: moment("2023-01-10").format("YYYY-MM-DD HH:mm:ss"),
        updatedAt: moment("2023-01-10").format("YYYY-MM-DD HH:mm:ss"),
      },
      {
        id: 2,
        runtime: moment("2023-01-20").format("YYYY-MM-DD HH:mm:ss"),
        message: "Test message 2",
        createdAt: moment("2023-01-12").format("YYYY-MM-DD HH:mm:ss"),
        updatedAt: moment("2023-01-12").format("YYYY-MM-DD HH:mm:ss"),
      },
    ];

    findAllMock.mockResolvedValue(getData);

    const req = {
      query: {},
    };

    await getAllSchedule(req, cbMock);

    expect(findAllMock).toHaveBeenCalledWith({
      where: {},
      offset: 0,
      limit: 10,
    });
    expect(cbMock).toHaveBeenCalledWith(null, getData);
  });

  test("should return error if an exception is thrown", async () => {
    const error = new Error("Database error");
    findAllMock.mockRejectedValue(error);

    const req = {
      query: {
        from: "2023-01-01",
        to: "2023-01-31",
      },
    };

    await getAllSchedule(req, cbMock);

    expect(findAllMock).toHaveBeenCalled();
    expect(cbMock).toHaveBeenCalledWith(error);
  });
});

describe("getListSms", () => {
  let findAllMock;
  let cbMock;

  beforeEach(() => {
    findAllMock = jest.spyOn(SchedulesHistories, "findAll");
    cbMock = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should return error message if "from" or "to" is missing', async () => {
    const req = {
      query: {
        from: "",
        to: "",
      },
    };

    await getListSms(req, cbMock);

    expect(cbMock).toHaveBeenCalledWith("for range, please add from and to!");
  });

  test('should return error message if "status" is not valid', async () => {
    const req = {
      query: {
        from: "2023-01-01",
        to: "2023-01-31",
        status: "INVALID",
      },
    };

    await getListSms(req, cbMock);

    expect(cbMock).toHaveBeenCalledWith(
      "status is not between ACCEPTD, DELIVRD, UNDELIV, UNKNOWN"
    );
  });

  test("should return data within the specified range and status", async () => {
    const from = "2023-01-01";
    const to = "2023-01-31";
    const status = "DELIVRD";

    const getData = [
      {
        id: 1,
        createdAt: "2023-01-10",
        status: "DELIVRD",
        Schedule: {
          id: 1,
          runtime: "2023-01-15",
          SmsScheduler: {
            id: 1,
            message: "Test message 1",
            createdAt: "2023-01-10",
            updatedAt: "2023-01-10",
          },
        },
      },
      {
        id: 2,
        createdAt: "2023-01-12",
        status: "DELIVRD",
        Schedule: {
          id: 2,
          runtime: "2023-01-20",
          SmsScheduler: {
            id: 2,
            message: "Test message 2",
            createdAt: "2023-01-12",
            updatedAt: "2023-01-12",
          },
        },
      },
    ];

    findAllMock.mockResolvedValue(getData);

    const req = {
      query: {
        from,
        to,
        status,
      },
    };

    await getListSms(req, cbMock);

    expect(findAllMock).toHaveBeenCalledWith({
      where: {
        createdAt: {
          [Op.between]: [from, to],
        },
        status: "DELIVRD",
      },
      offset: 0,
      limit: 10,
      include: {
        model: Schedule,
        include: {
          model: SmsScheduler,
        },
      },
    });

    expect(cbMock).toHaveBeenCalledWith(null, getData);
  });

  test("should return empty array if no data found within the specified range and status", async () => {
    const from = "2023-01-01";
    const to = "2023-01-31";
    const status = "ACCEPTD";

    findAllMock.mockResolvedValue([]);

    const req = {
      query: {
        from,
        to,
        status,
      },
    };

    await getListSms(req, cbMock);

    expect(findAllMock).toHaveBeenCalledWith({
      where: {
        createdAt: {
          [Op.between]: [from, to],
        },
        status: "ACCEPTD",
      },
      offset: 0,
      limit: 10,
      include: {
        model: Schedule,
        include: {
          model: SmsScheduler,
        },
      },
    });

    expect(cbMock).toHaveBeenCalledWith(null, []);
  });

  test("should return error if an exception is thrown", async () => {
    const error = new Error("Database error");
    findAllMock.mockRejectedValue(error);

    const req = {
      query: {
        from: "2023-01-01",
        to: "2023-01-31",
        status: "DELIVRD",
      },
    };

    await getListSms(req, cbMock);

    expect(findAllMock).toHaveBeenCalled();
    expect(cbMock).toHaveBeenCalledWith(error);
  });
});

describe("addSchedule", () => {
  let createMock;
  let cbMock;

  beforeEach(() => {
    createMock = jest.spyOn(SmsScheduler, "create");
    cbMock = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should return error message if "runtime" or "message" is missing', async () => {
    const req = {
      body: {},
    };

    await addSchedule(req, cbMock);

    expect(cbMock).toHaveBeenCalledWith("runtime || message body is missing!");
  });

  test("should create a new schedule and return the created schedule", async () => {
    const runtime = "2023-01-15";
    const message = "Test message";

    const createdSchedule = {
      id: 1,
      runtime: "2023-01-15",
      message: "Test message",
      createdAt: "2023-01-10",
      updatedAt: "2023-01-10",
    };

    createMock.mockResolvedValue(createdSchedule);

    const req = {
      body: {
        runtime,
        message,
      },
    };

    await addSchedule(req, cbMock);

    expect(createMock).toHaveBeenCalledWith({
      runtime,
      message,
    });

    expect(cbMock).toHaveBeenCalledWith(null, createdSchedule);
  });

  test("should return error if an exception is thrown", async () => {
    const error = new Error("Database error");
    createMock.mockRejectedValue(error);

    const req = {
      body: {
        runtime: "2023-01-15",
        message: "Test message",
      },
    };

    await addSchedule(req, cbMock);

    expect(createMock).toHaveBeenCalled();
    expect(cbMock).toHaveBeenCalledWith(error);
  });
});
