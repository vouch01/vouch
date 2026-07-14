import { Payment } from "./nomba.service.js";
import { eq, and, desc, inArray, isNull } from "drizzle-orm";
import { db } from "../db/index.js";
import { vendors, orders, webhook_events, otp_tokens } from "../db/schema.js";
import { generateUniqueOtp, generateUniqueToken } from "../utils/uuid.js";
import { formatNombaDate, koboToNombaFormat, nairaToKobo } from "../utils/nomba.js";
import { handleNombaError } from "../utils/nombaError.js";
import bcrypt from "bcrypt";
import { connection } from "../lib/redis.js";

interface OrderPaymentDetails {
  virtual_account_ref: string;
  expected_amount: number;
  expires_at: Date;
}
export const collectOrderPayment = async (checkout_token: string) => {
  try {
    const order = await db.query.orders.findFirst({
      where: eq(orders.checkout_token, checkout_token),
    });
    if (!order) {
      return { status: 404, success: false, message: "Order not found" };
    }

    const vendor = await db.query.vendors.findFirst({
      where: eq(vendors.id, order.vendor_id),
    });
    const businessName = vendor?.business_name;

    const virtual_account_ref = generateUniqueToken(22);
    const {
      expected_amount,
      expires_at,
      buyer_phone,
      item_name,
      item_description,
    } = order;
    const nombaTimeFormat = formatNombaDate(expires_at);

    const formattedAmount = Math.round(expected_amount/100)

    const { bankAccountName, bankAccountNumber, expiryDate } =
      await Payment.createVirtualAccountForSubAccount(
        virtual_account_ref,
        formattedAmount,
        nombaTimeFormat,
      );

    const paymentDetails = { bankAccountName, bankAccountNumber, expiryDate };
    const orderDetails = {
      buyer_phone,
      item_name,
      item_description,
      businessName,
      formattedAmount,
    };
    // console.log("virtual_account_details;",details )
    return {
      status: 200,
      success: true,
      message: "Virtual account sent successfully",
      data: { paymentDetails, orderDetails },
    };
  } catch (err: any) {
    console.error("Nomba error", err.message);
    return handleNombaError(err);
  }
};


export const processOrderPayment = async (payload: any) => {
  try {
    const {event_type, data} =payload

    const { transaction} = data
    const { transactionAmount, transactionId } = transaction;
    const acctReference = transaction?.aliasAccountReference;

    const [order, alreadyProcessed] = await Promise.all([
      db.query.orders.findFirst({
        where: eq(orders.virtual_account_ref, acctReference),
      }),
      db.query.webhook_events.findFirst({
        where: eq(
          webhook_events.nomba_transaction_id,
          transaction.transactionId,
        ),
      }),
    ]);

        if(!order){
            console.log("Order not found")
            return{status:404, success:false, message:" Order not found"}
        }

        if (alreadyProcessed){
            console.log("Payment already processed")
            return{ status: 409, success:false, message: "Payment already processed"}
        }
        
        await db.insert(webhook_events).values({
            nomba_transaction_id:transactionId,
            order_id: order.id,
            event_type: event_type,
            payload: JSON.stringify(payload)
        })

        const amountPaid = nairaToKobo(transactionAmount)
        console.log("order-amount", amountPaid)

        if(amountPaid === order.expected_amount){
            const pin = generateUniqueOtp(4)
            console.log('delivery-pin', pin)
            const pinHash = await bcrypt.hash(pin, 10)

            await db.update(orders).set({
                status: 'PAID_IN_ESCROW',
                amount_paid: amountPaid,
                delivery_pin_hash: pinHash 
            }).where (eq(orders.id, order.id))

            await connection.set(`pin:${order.checkout_token}`, pin, 'EX', 600)
        }

        return {status:200, success:false, message: 'Payment processed successfully'}
  }  catch (err: any) {
    console.error("Error occurred while processing payment:", err.message);
    return { status: 500, success: false, message: err.message };
  }
};

/*
This function deducts vouch transaction fee[1.5% capped at 2k] 
and updates db only if the transfer is successful and not pending or failed.
It is triggered by the delivery pin input and uses the provider API response for settlements.
*/

export const settlePayment = async (order_id:string, accountName:string, accountNumber:string, bankCode:string, item_name:string, amount:number) =>{
  try{
 
    const order =await db.query.orders.findFirst({
    where: (eq(orders.id, order_id))
  })
  if(!order){
    return { status: 404, success: false, message: "Order not found" }
  }
  if (order.status === 'SETTLED' || order.transaction_ref) {
      return { status: 409, success: false, message: "Payout already  settled" }
    }

    let fee:number

    fee =  Math.round(amount * 1.5/100)
    if(fee >= 2000)
      fee = 2000

  const payout = Math.round(amount - fee) 
  const safePayout = Math.round(payout * 100)
  
  const narration = `Vouch's Escrow Payout for ${item_name}`
  const senderName = 'Vouch Escrow'
  const merchantTxRef = generateUniqueToken(22)
  
  //DB reconcilation
  await db.update(orders).set({
      transaction_ref: merchantTxRef,
      fee,
      payout_amount: safePayout
    }).where(eq(orders.id, order_id))

  const bankTransferDetails = {amount: payout, accountNumber, accountName, bankCode,merchantTxRef, senderName, narration}

  const response = await Payment.transferFundsFromSubAccountToBank(bankTransferDetails)
   console.log('Transfer response:', JSON.stringify(response, null, 2))

  return {status:200, success:true, message: "Funds released successfully"}
  }catch (err: any) {
    console.error("Nomba error", err.message);
    return handleNombaError(err);
  }
}


/*
This function updates db only if the transfer is successful and not pending or failed.
It is triggered by the webhook notification for bank transfers from sub account.
*/


export const settleWebhookConfirmation = async (payload :any) => {
  try{
    const {event_type, data} = payload
    const {transaction} = data
    const {merchantTxRef, transactionId } = transaction

    const order = await db.query.orders.findFirst({
      where: eq(orders.transaction_ref, merchantTxRef)
    })

    if(!order){
       console.error('No matching order for payout ref:', merchantTxRef)
      return {status: 409, success:true,  message: "Payout processed"}
    }

 if(order.status === 'SETTLED'){
  return { status: 200, success: true, message: "Already settled" }
 }

    await db.update(orders).set({
    status: 'SETTLED',
    settled_at: new Date(),
    })

    await db.insert(webhook_events).values({
            nomba_transaction_id: transactionId,
            order_id: order.id,
            event_type,
            payload: JSON.stringify(payload)
        })

      return {status:200, success:true, message: "Settlement confirmed"}

  }catch (err: any) {
    console.error("Nomba error", err.message);
    return handleNombaError(err);
  }
}
