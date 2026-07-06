import express from "express";
import request from "supertest";
import app from "../app.js";

const router = express.Router();

jest.setTimeout(15000);

describe("Profile actions", () => {
  let otp: string;
  let email:string;
  let token:string
  let id:string

//   let TEST_EMAIL= ""

    beforeAll(async () => {
    const loginRes = await request(app)
      .post("/v1/auth/login")
      .send({
      email: "iziogbaraymond72@gmail.com",
      password: "Test1234!",
      });
    token = loginRes.body.token;
  });

  it("returns status code 200 if vendor is retrieved successfully", async() =>{
    const res = await request(app)
    .get("/v1/profile/retrieve")
     .set("Authorization", `Bearer ${token}`)   

     expect(res.statusCode).toEqual(200);
    expect(res.body.message).toContain("successfully");
    expect(res.body.data.business_name).toBe("Test Business");
    expect(res.body.data).toBeDefined()
    
  })
})