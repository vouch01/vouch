import express from "express";
import request from "supertest";
import app from "../app.js";

const router = express.Router();

jest.setTimeout(15000);

describe("Payment flow", () => {
  let token: string;
  let id: string;
  let checkoutToken:string

  beforeAll(async () => {
    const loginRes = await request(app).post("/v1/auth/login").send({
      email: "iziogbaraymond72@gmail.com",
      password: "Test1234!",
    });
    token = loginRes.body.token;

    const res = await request(app)
    .post("/v1/order/create")
     .set("Authorization", `Bearer ${token}`)
     .send({
        buyer_phone:"92049903114",
        item_description:"ows gadgets",
        additional_notes: "Keep it neat",
        delivery_address: "new wplace way ",
         amount: 30000,
     })   
     id =res.body.data.id
     checkoutToken= res.body.data.checkout_token
  });

  it("returns virtual account details successfully", async () => {
    const res = await request(app)
      .get(`/v1/pay/${checkoutToken}`)
      .set("Authorization", `Bearer ${token}`)

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toContain('successfully');
      expect(res.body.data).toBeDefined()
  });
    
});
