import { Payment } from "./nomba.service.js"
import { eq, and, desc, inArray, isNull } from "drizzle-orm";
import { db } from "../db/index.js";
import { vendors, orders, webhook_events, otp_tokens } from "../db/schema.js";
import { generateUniqueToken } from "../utils/uuid.js";
import { formatNombaDate, koboToNombaFormat } from "../utils/nomba.js";
import { handleNombaError } from "../lib/nombaError.js";


interface OrderPaymentDetails {
    virtual_account_ref: string,
    expected_amount: number,
    expires_at: Date,
}
export const collectOrderPayment = async ( checkout_token:string ) => {
    try{

        const order = await db.query.orders.findFirst({
            where:eq(orders.checkout_token, checkout_token)
        })
        if(!order){
            return{status:404, success:false, message: "Order not found"}
        }
        
        const vendor = await db.query.vendors.findFirst({
            where: eq(vendors.id, order.vendor_id)
        })
        const businessName=  vendor?.business_name

        const virtual_account_ref= generateUniqueToken(22)
        const {expected_amount, expires_at, buyer_phone, item_name, item_description} = order
        const nombaTimeFormat = formatNombaDate(expires_at)

    const formattedAmount = koboToNombaFormat(expected_amount)

        const {bankAccountName, bankAccountNumber, expiryDate} = await Payment.createVirtualAccountForSubAccount(virtual_account_ref, formattedAmount, nombaTimeFormat)
        
        const paymentDetails ={bankAccountName, bankAccountNumber, expiryDate}
        const orderDetails = {buyer_phone, item_name, item_description, businessName}
        // console.log("virtual_account_details;",details )
        return{
            status:200,
            success:true,
            message:"Virtual account sent successfully",
            data:{paymentDetails, orderDetails}
        }
    }catch (err: any){
      console.error("Nomba error", err.message);
        return handleNombaError(err)
      }
}

export const processOrderPayment = async (payload:any) =>{
    try{
        const { transaction, merchant, data} = payload.data
        const accountName = payload.data.bankAccountName
        // const order =

    }catch (err: any){
      console.error("Nomba error", err.message);
        return handleNombaError(err)
      }
}


