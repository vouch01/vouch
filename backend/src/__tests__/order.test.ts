import express from "express";
import request from "supertest";
import app from "../app.js";

const router = express.Router();

jest.setTimeout(15000);

describe("Order Flow", () => {
    let token:string

beforeAll(async () => {
    const loginRes = await request(app)
      .post("/v1/auth/login")
      .send({
      email: "iziogbaraymond72@gmail.com",
      password: "Test1234!",
      });
    token = loginRes.body.token;
  });

  it("returns status code 201 if order is created successfully", async() =>{
    const res = await request(app)
    .post("/v1/order/create")
     .set("Authorization", `Bearer ${token}`)
     .send({
        buyer_phone:"09117053519",
        item_description:"ows gadgets",
        additional_notes: "Keep it neat",
        delivery_address: "new wplace way ",
         amount: 30000
     })   

     expect(res.statusCode).toEqual(201);
    expect(res.body.message).toContain("Successfully");
    expect(res.body.data.item_description).toContain("ows");
    expect(res.body.escrowLink).toBeDefined()
  })
})