import express from "express";
import request from "supertest";
import app from "../app.js";

const router = express.Router();

jest.setTimeout(15000);

// describe("sanity check", () => {
//  it("should pass", () => {
//     expect(1 + 1).toBe(2);
//   });
// });

describe("Auth flow ", () => {
  it.skip("returns status code 201 if user is created successfully", async () => {
    const res = await request(app).post("/v1/auth/signup").send({
      business_name: "Test Business",
      email: "test@example.com",
      password: "password123",
      bank_account_number: "ACC123456",
      bank_account_name: "Test Account",
    });
    expect(res.statusCode).toEqual(201);
    expect(res.body.token).toBeDefined();
    expect(res.body.message).toContain("successfully");
  });

  it.skip("returns status code 200 if user logged in successfuly", async () => {
    const res = await request(app)
      .post("/v1/auth/login")
      .send({
        email: "test@example.com",
        password: "password123",
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body.token).toBeDefined()
    expect(res.body.message).toContain("successful");
  });
});


// describe("Password reset flow", () => {
//   let otp: string;
//   let email:string;
//   it("returns status code 200 if otp is generated successfully", async() =>{
//     const res = await request(app)
//     .post("/v1/auth/otp")
//     .send({
//       email: "test@example.com"
//     })
//      expect(res.statusCode).toEqual(200);
//     expect(res.body.message).toContain("successfully");

//     otp = res.body.otp
//   })
//   it("returns status code 200, if otp verifies successfully", async ()=> {
//     const res = await request(app)
//     .post("/v1/auth/verify")
//     .send({
//       email: "test@example.com",
//       otp
//     })
//      expect(res.statusCode).toEqual(200);
//     expect(res.body.message).toContain("successfully");
//   }
// )
// })


