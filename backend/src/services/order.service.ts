import { eq, and, desc, inArray, isNull } from "drizzle-orm";
import { db } from "../db/index.js";
import { vendors, orders, webhook_events, otp_tokens } from "../db/schema.js";
import { generateUniqueToken } from "../utils/uuid.js";
import crypto from "crypto";
import { nairaToKobo } from "../utils/nomba.js";
import {connection} from '../lib/redis.js'
import bcrypt from 'bcrypt'

interface OrderInputs {
  vendor_id: string;
  buyer_phone: string;
  item_description: string;
  amount: number;
  additional_notes: string;
  delivery_address: string;
  item_name:string
}

type orderStatus =
  | "PENDING_PAYMENT"
  | "PAID_IN_ESCROW"
  | "DISPATCHED"
  | "SETTLED"
  | "EXPIRED"
  | "REFUNDED";

const baseUrl = process.env.BASE_URL

export const createOrder = async (orderData: OrderInputs, vendor_id:string) => {
  try {
    const {
      buyer_phone,
      item_description,
      item_name,
      amount,
      additional_notes,
      delivery_address,
    } = orderData;

    const key = crypto
      .createHmac("sha256", "neworder")
      .update(`${vendor_id}-${buyer_phone}-${item_description}-${amount}`)
      .digest("hex");

    const existingOrder = await db.query.orders.findFirst({
      where: eq(orders.idempotency_key, key),
    });
    if (existingOrder) {
      return {
        status: 200,
        success: true,
        message: "order retrieved",
        escrowLink: `${baseUrl}/pay/${existingOrder.checkout_token}`,
        data: existingOrder,
      };
    }
    const checkoutToken = generateUniqueToken(12);
    const virtual_account_ref = generateUniqueToken(24);
    const expires_at = new Date(Date.now() + 60 * 60 * 1000);

    const safeKoboAmount = nairaToKobo(amount)
    const order = await db
      .insert(orders)
      .values({
        vendor_id,
        buyer_phone,
        idempotency_key: key,
        item_description,
        item_name,
        additional_notes,
        delivery_address,
        virtual_account_ref,
        checkout_token: checkoutToken,
        expected_amount: safeKoboAmount,
        expires_at,
      })
      .returning();
    const escrowLink = `${baseUrl}/pay/${checkoutToken}`;

    return {
      status: 201,
      success: true,
      message: "Order created Successfully",
      escrowLink,
      data: order[0],
    };
  } catch (err: any) {
    console.error("Error occurred while creating order:", err.message);
    return { status: 500, success: false, message: err.message };
  }
};



export const getAllOrders = async (vendor_id:string) =>{
    try{
    const existingOrders = await db.query.orders.findMany({
        where: and(eq(orders.vendor_id, vendor_id), isNull(orders.deleted_at))
    })
    return{
        status:200,
        success:true,
        data:existingOrders,
        message: "Orders retrieved successfully"
    }
}catch (err: any) {
    console.error("Error occurred while retrieving order:", err.message);
    return { status: 500, success: false, message: err.message };
  }
}


export const getOrderById = async (vendor_id:string,id:string) =>{
    try{
    const order = await db.query.orders.findFirst({
        where: and(eq(orders.vendor_id, vendor_id), eq(orders.id, id))
    })
    if (!order || order.deleted_at !== null){
        return {status:404, success:false, message:  "Order not found"}
    }
    return{
        status:200,
        success:true,
        data:order,
        message: "Order retrieved successfully"
    }
}catch (err: any) {
    console.error("Error occurred while retrieving order by id:", err.message);
    return { status: 500, success: false, message: err.message };
  }
}

export const deleteOrderById = async(vendor_id:string, id:string) =>{
    try{
        const existingOrder = await db.query.orders.findFirst({
            where: and(eq(orders.id, id), eq(orders.vendor_id, vendor_id))
        })
        if(!existingOrder){
            return { status: 404, success: false, message: "order not found" };
        }
        await db.update(orders)
        .set({ deleted_at: new Date() })
      .where(eq(orders.id, id));

      return {
      status: 200,
      success: true,
      message: "Order deleted successfully",
      }
    }catch (err: any) {
    console.error("Error occurred while deleting order:", err.message);
    return { status: 500, success: false, message: err.message };
  }
}

export const getOrderAuthPin  =  async(checkoutToken:string) =>{
    try{
        const order = await db.query.orders.findFirst({
            where: eq(orders.checkout_token, checkoutToken)
        })
        if(!order){
                  return { status: 404, success: false, message: 'Order not found' }
        }

    let pin: string | null = null
    if (order.status === 'PAID_IN_ESCROW') {
      pin = await connection.get(`pin:${checkoutToken}`)
      if (pin) 
        await connection.del(`pin:${checkoutToken}`)  
    }

    return{
        status: 200,
      success: true,
      data: {
        orderStatus: order.status,
        expectedAmount: order.expected_amount,
        amountPaid: order.amount_paid,
        virtualAccountNumber: order.virtual_account_number,
        expiresAt: order.expires_at,
        pin
    }
    }
}catch (err: any) {
    console.error("Error occurred while fetching order auth pin:", err.message);
    return { status: 500, success: false, message: err.message };
  }
}

export const generateRiderLink  = async  (orderId:string, vendor_id:string) =>{
  try{
    const order = await db.query.orders.findFirst({
      where: and(eq(orders.id, orderId), eq(orders.vendor_id,vendor_id ))
    })
    if(!order){
      return {status:404, success:false, message :"Order not found"}
    }
    const ridertoken =  generateUniqueToken(12)
    await db.update(orders).set({
      rider_token: ridertoken,
      status: 'DISPATCHED'
    }).where(eq(orders.id, order.id))
    
   
    const riderLink = `${baseUrl}/verify/${ridertoken}`
    return {status:200, success:true, message:"Rider link generated successfully", riderLink}
  }catch (err: any) {
    console.error("Error occurred while generating rider link:", err.message);
    return { status: 500, success: false, message: err.message };
  }
}


export const riderCheckout = async(riderToken:string) =>{
  try{
    const order = await db.query.orders.findFirst({
      where: eq(orders.rider_token, riderToken)
    })
    if(!order){
      return{status:404, success:false , message: "Order not found"}
    }
    const {id, delivery_address, status} =order 
    const orderDetails = { id, delivery_address, status}
    return{
      status:200, 
      success:true,
      message:"Order retrieved successfully",
      data:orderDetails
    }
  }catch (err: any) {
    console.error("Error occurred in rider checkout", err.message);
    return { status: 500, success: false, message: err.message };
  }
}


export const verifyOrderDelivery = async (riderToken:string, pin:string) => {
  try{
    const order = await db.query.orders.findFirst({
      where:and(eq(orders.rider_token, riderToken))
    })
    if(!order){
      return{status:404, success:false, message:"Order not found"}
    }
    const isPinValid = await bcrypt.compare(
      pin,
      order.delivery_pin_hash!
    )
    if(!isPinValid){
      return {status:404, success:false, message: "Invalid delivery pin"}
    }
    await db.update(orders).set({
      pin_submitted_at: new Date()
    }).where(eq(orders.id, order.id))

    return {status:200,success:true, message: "Delivery Verified Successfully"}
    //setllement to worker 
  }catch (err: any) {
    console.error("Error occurred in  delivery verification", err.message);
    return { status: 500, success: false, message: err.message };
  }
}