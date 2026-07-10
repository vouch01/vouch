import { Payment } from "./nomba.service.js";
import { eq, and, desc, inArray, isNull } from "drizzle-orm";
import { db } from "../db/index.js";
import { vendors, orders, webhook_events, otp_tokens } from "../db/schema.js";
import { generateUniqueOtp, generateUniqueToken } from "../utils/uuid.js";
import { formatNombaDate, koboToNombaFormat, nairaToKobo } from "../utils/nomba.js";
import { handleNombaError } from "../lib/nombaError.js";
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

    const formattedAmount = koboToNombaFormat(expected_amount);

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
    console.log("Webhook-data-from-processOrderService", payload)

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
            return{ status: 409, success:false, message: "Payment already processed"}
        }
        
        await db.insert(webhook_events).values({
            nomba_transaction_id:transactionId,
            order_id: order.id,
            event_type: event_type,
            payload: JSON.stringify(payload)
        })

        const amount = koboToNombaFormat(order.expected_amount)
        console.log("order-amount", amount)
        
        if(transactionAmount === amount){
            const pin =await generateUniqueOtp(4)
            const pinHash = await bcrypt.hash(pin, 10)

            const safeAmount = nairaToKobo(amount)

            await db.update(orders).set({
                status: 'PAID_IN_ESCROW',
                amount_paid: safeAmount,
                delivery_pin_hash: pinHash 
            }).where (eq(orders.id, order.id))

            await connection.set(`pin:${order.checkout_token}`, pin, 'EX', 300)
        }

        return {status:200, success:false, message: 'Payment processed successfully'}
  }  catch (err: any) {
    console.error("Error occurred while processing payment:", err.message);
    return { status: 500, success: false, message: err.message };
  }
};


