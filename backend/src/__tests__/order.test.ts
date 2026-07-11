import express from "express";
import request from "supertest";
import app from "../app.js";

const router = express.Router();

jest.setTimeout(15000);

describe("Order Flow", () => {
    let token:string
    let id:string

beforeAll(async () => {
    const loginRes = await request(app)
      .post("/v1/auth/login")
      .send({
      email: "iziogbaraymond72@gmail.com",
      password: "Test1234!",
      });
    token = loginRes.body.token;
  });

  it.skip("returns status code 201 if order is created successfully", async() =>{
    const res = await request(app)
    .post("/v1/order/create")
     .set("Authorization", `Bearer ${token}`)
     .send({
        buyer_phone:"92049905114",
        item_description:"ows gadgets",
        additional_notes: "Keep it neat",
        delivery_address: "new wplace way ",
         amount: 30000
     })   
     id =res.body.data.id

     expect(res.statusCode).toEqual(201);
    expect(res.body.message).toContain("Successfully");
    expect(res.body.data.item_description).toContain("ows");
    expect(res.body.escrowLink).toBeDefined()
  })
  
   it.skip("returns status code 200 if order is retrieved successfully", async() =>{
    const res = await request(app)
    .get(`/v1/order/${id}`)
     .set("Authorization", `Bearer ${token}`)

     expect(res.statusCode).toEqual(200);
    expect(res.body.message).toContain("successfully");
    expect(res.body.data.item_description).toContain("ows");
  })

   it.skip("returns status code 200 if all order is retrieved successfully", async() =>{
    const res = await request(app)
    .get('/v1/order/all')
     .set("Authorization", `Bearer ${token}`) 

        console.log("orders; ", res.body.data)

     expect(res.statusCode).toEqual(200);
    expect(res.body.message).toContain("successfully");
    expect(res.body.data).toBeDefined()

  })

  it("returns status code 200 if  rider link  is generated successfully", async() =>{
    const orderId:string= 'd3bdcf50-a3a2-45e0-9503-bdfda29fe275'
    const res = await request(app)
    .get(`/v1/order/generate/${orderId}`)
     .set("Authorization", `Bearer ${token}`) 

    console.log("riderLink", res.body.riderLink)

     expect(res.statusCode).toEqual(200);
    expect(res.body.riderLink).toBeDefined()
    expect(res.body.message).toContain("successfully")

  })

  it.skip("returns status code 200 if all order auth pin is retrieved successfully", async() =>{
    const res = await request(app)
    .get(`/v1/order/status/${'y1nrI1o946wp'}`)

     expect(res.statusCode).toEqual(200);
     expect(res.body.data.pin).toBeDefined()
    // expect(res.body.message).toContain("successfully");

  })

  it.skip("returns status code 200 if order is deleted successfully", async() =>{
    const res = await request(app)
    .delete(`/v1/order/cancel/${id}`)
     .set("Authorization", `Bearer ${token}`)

     expect(res.statusCode).toEqual(200);
    expect(res.body.message).toContain("successfully");
  })
})