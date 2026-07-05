import express from "express";
import request from "supertest";
import app from "../app.js";

const router = express.Router();

jest.setTimeout(30000);

const TEST_EMAIL = "iziogbaraymond72@gmail.com"
const TEST_PASSWORD = "Test1234!"

// describe("sanity check", () => {
//  it("should pass", () => {
//     expect(1 + 1).toBe(2);
//   });
// });

describe.skip("Auth flow ", () => {
  it("returns status code 201 if user is created successfully", async () => {
    const res = await request(app).post("/v1/auth/signup").send({
      business_name: "Test Business",
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
      bank_account_number: "ACC123456",
      bank_account_name: "Test Account",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.message).toContain("successfully");
  });

  it("returns status code 200 if user logged in successfuly", async () => {
    const res = await request(app)
      .post("/v1/auth/login")
      .send({
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined()
    expect(res.body.message).toContain("successful");
  });
});


describe("Password reset flow", () => {
  let otp: string;
  
  it("returns status code 200 if otp is generated successfully", async() =>{
    const res = await request(app)
    .get("/v1/auth/otp")
    .send({
      email: TEST_EMAIL
    })
     expect(res.statusCode).toEqual(200);
    expect(res.body.message).toContain("successfully");

    otp = res.body.otp
  })
  it("returns status code 200, if otp verifies successfully", async ()=> {
    const res = await request(app)
    .post("/v1/auth/verify")
    .send({
      email: TEST_EMAIL,
      otp
    })
     expect(res.statusCode).toEqual(200);
    expect(res.body.message).toContain("successfully");
  }
)
})


