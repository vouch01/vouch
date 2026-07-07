import { eq, and, desc, inArray, isNull } from "drizzle-orm";
import { db } from "../db/index.js";
import { vendors, orders, webhook_events, otp_tokens } from "../db/schema.js";
import { generateUniqueToken } from "../utils/uuid.js";
import crypto from "crypto";
import { date } from "drizzle-orm/mysql-core";

interface OrderInputs {
  vendor_id: string;
  buyer_phone: string;
  item_description: string;
  amount: number;
  additional_notes: string;
  delivery_address: string;
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
    const expires_at = new Date(Date.now() + 30 * 60 * 1000);

    const order = await db
      .insert(orders)
      .values({
        vendor_id,
        buyer_phone,
        idempotency_key: key,
        item_description,
        additional_notes,
        delivery_address,
        virtual_account_ref,
        checkout_token: checkoutToken,
        expected_amount: amount,
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



export const getAllOrders = async () =>{
    try{
    const orderList = await db.select().from(orders)
    const existingOrders =orderList.filter(order => {
        return order.deleted_at === null
    } )
    return{
        status:200,
        success:true,
        data:existingOrders,
        message: "Orders retrieved successfully"
    }
}catch (err: any) {
    console.error("Error occurred while creating order:", err.message);
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
    console.error("Error occurred while creating order:", err.message);
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