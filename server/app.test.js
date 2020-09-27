const request = require("supertest");
const app = require("./app");

/** Mock the json data being returned so it does not
 * rely on generator running first
 */
jest.mock("../endpointData.json", () => {
  return { test: "data" };
});

/** After each test, clear mock data */
afterEach(() => jest.clearAllMocks());

describe("getVisibleTables endpoint", () => {
  let accessToken;

  /**  Before any calls to /getVisibleTables, hit the login endpoint
   * and save the accessToken value for use in each call */
  beforeAll(async () => {
    const tokenRequest = await request(app).post("/login", {
      username: "TestUser",
    });
    accessToken = tokenRequest.body.accessToken;
  });

  it("should not allow unauthenticated access", async () => {
    const response = await request(app).get("/getVisibleTables");

    expect(response.status).toBe(401);
    expect(response.text).toEqual("No token provided");
  });

  it("should not allow expired or incorrect tokens", async () => {
    const response = await request(app)
      .get("/getVisibleTables")
      .set("Authorization", `Bearer invalidToken`);

    expect(response.status).toBe(403);
    expect(response.text).toEqual("Token is invalid");
  });

  it("should allow authenticated get calls", async () => {
    const response = await request(app)
      .get("/getVisibleTables")
      .set("Authorization", `Bearer ${accessToken}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ test: "data" });
  });

  it("should not allow authenticated post calls", async () => {
    const response = await request(app).post("/getVisibleTables");

    expect(response.status).toBe(404);
  });
});

describe("login endpoint", () => {
  it("should return a token", async () => {
    const postData = { username: "TestUser" };
    const response = await request(app).post("/login", postData);

    expect(response.status).toBe(200);
    expect(response.body.accessToken).not.toBe(undefined);
  });
});

describe("viewTabularData endpoint", () => {
  it("should return a html file", async () => {
    const response = await request(app).get("/viewTabularData");

    expect(response.status).toBe(200);
    expect(response.type).toBe("text/html");
    expect(response.text).not.toBe(undefined);
  });
});
