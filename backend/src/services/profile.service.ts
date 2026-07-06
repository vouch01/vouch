import { eq , and , desc } from "drizzle-orm";
import { db } from "../db/index.js";
import { vendors, orders, webhook_events, otp_tokens } from "../db/schema.js";

interface VendorInputs {
  business_name: string;
  email: string;
  password: string;
}

export const  retrieveVendorById = async (id :string ) =>{
    try{
        const vendor = await db.query.vendors.findFirst({
      where: eq(vendors.id, id)
    })
    if(!vendor){
        return {status:404, success:false, message: "vendor not found"}
    }
    const { password_hash, ...safeVendor } = vendor
    return {status:200,success:true, message : "Vendor retrieved successfully", data:safeVendor}
    
    } catch (err: any) {
    console.error("Error occurred while retrieving vendor:", err.message);
    return { status: 500, success: false, message: err.message };
    }
}