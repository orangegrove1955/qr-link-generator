const {
  getData,
  generateLink,
  generateQR,
  writeJSONtoFile,
  runGenerator,
} = require("./generator");
const axios = require("axios");
const qrcode = require("qrcode");
const fs = require("fs");

// Mock fs to prevent actual file writes
jest.mock("fs");
fs.writeFile.mockResolvedValue("Mocked FS resolve");

/** After each test, clear mock data */
afterEach(() => jest.clearAllMocks());

describe("generateLink", () => {
  const url =
    "https://dev.hungryhungry.com/oceana2/menu?locationID=1995257&tableID=60";

  it("should generate a link", () => {
    const link = generateLink(61);
    expect(link).not.toBe(undefined);
  });

  it("should generate a link when a number is provided as tableID", () => {
    expect(generateLink(60)).toEqual(url);
  });

  it("should generate a link when a string is provided as tableID", () => {
    expect(generateLink("60")).toEqual(url);
  });

  it("should throw an error when no tableID is provided", () => {
    expect(() => generateLink()).toThrow("tableID cannot be undefined");
  });
});

describe("generateQR", () => {
  const qrData = [
    { tableID: 1, qrLink: "Example1" },
    { tableID: 2, qrLink: "Example2" },
    { tableID: 3, qrLink: "Example3" },
  ];

  /** After each test, clear mock data */
  afterEach(() => jest.clearAllMocks());

  it("should generate a qr code", async () => {
    const output = await generateQR(qrData[0]);

    expect(qrcode.toFile).toHaveBeenCalledTimes(1);
    expect(qrcode.toFile).toHaveBeenCalledWith(
      "./qrcode_output/1.png",
      "Example1"
    );
  });

  // it("should throw an error when qrcode generator fails", () => {
  //   const errorMessage = "QR Generator failed";
  //   qrcode.toFile.mockImplementationOnce(() =>
  //     Promise.reject(new Error(errorMessage))
  //   );

  //   expect(() => generateQR(qrData[0])).rejects.toBeTruthy();
  //   expect(qrcode.toFile).toHaveBeenCalledTimes(1);
  //   expect(qrcode.toFile).toHaveBeenCalledWith(
  //     "./qrcode_output/1.png",
  //     "Example1"
  //   );
  // });
});

describe("getData", () => {
  const testData = {
    Front: {
      name: "Front",
      tables: {
        62: { name: "Invalid table name", visible: 0 },
        63: { name: "101", visible: 1 },
        64: { name: "102", visible: 1 },
        65: { name: "103", visible: 1 },
        66: { name: "104", visible: 1 },
      },
    },
    Back: {
      name: "Back",
      tables: {
        35: { name: "301", visible: 1 },
        36: { name: "302", visible: 1 },
        37: { name: "303", visible: 1 },
        38: { name: "304", visible: 1 },
        39: { name: "305", visible: 1 },
        40: { name: "Invalid table name", visible: 0 },
      },
    },
    A: {
      name: "A",
      tables: { 118: { name: "1", visible: 0 } },
      active_tables: 0,
      is_legacy: "false",
    },
  };

  it("should call axios and return json data", async () => {
    // Use test data for mock call
    axios.get.mockImplementationOnce(() => Promise.resolve({ data: testData }));

    let responseData = await getData();

    expect(responseData).toEqual(testData);
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      "https://hungryhungry.com/helping-hospo/hh_test_tabledata.json"
    );
  });

  it("should throw an error when axios fails", async () => {
    const errorMessage = "API call failed";
    axios.get.mockImplementationOnce(() =>
      Promise.reject(new Error(errorMessage))
    );

    expect(() => getData()).rejects.toThrow(
      "Error occurred while getting data"
    );
    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith(
      "https://hungryhungry.com/helping-hospo/hh_test_tabledata.json"
    );
  });
});

describe("writeJSONtoFile", () => {
  it("should write json data to file", async () => {
    const response = await writeJSONtoFile("./test-location.json", {
      data: "test string",
    });

    expect(fs.writeFile).toHaveBeenCalledTimes(1);
  });

  it("should throw an error when no data is passed", async () => {
    expect(writeJSONtoFile).rejects.toBeTruthy();
  });
});

describe("runGenerator", () => {
  it("should successfully complete", async () => {
    const runner = await runGenerator();

    expect(runner).toEqual("Generator complete");
  });
});
