import { accessToken } from "./token.service.js";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { vendors, orders, webhook_events } from "../db/schema.js";

interface VendorInputs {
  business_name: string;
  email: string;
  password: string;
  bank_code: string;
  bank_account_number: string;
  bank_account_name: string;
}


export const createVendor = async (vendorData: VendorInputs) => {
  try {
    const {
      business_name,
      email,
      password,
      bank_code,
      bank_account_number,
      bank_account_name,
    } = vendorData;
    const existingVendor = await db
      .select()
      .from(vendors)
      .where(eq(vendors.email, email));
    if (existingVendor.length > 0) {
      return { status: 409, success: false, message: "user already Exists" };
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const newVendor = await db
      .insert(vendors)
      .values({
        business_name,
        email,
        password_hash: passwordHash,
        bank_code,
        bank_account_number,
        bank_account_name,
      })
      .returning();

      const token = accessToken(newVendor[0]!.id)
      const {password_hash,  ...vendor} = newVendor[0]!

    return {
      status: 201,
      success: true,
      message: ":vendor account created successfully",
      token,
      data:vendor,
    };
  } catch (err: any) {
    console.error("Error occurred while creating vendor:", err.message);
    return { status: 500, success: false, message: err.message };
  }
};



export const loginVendor = async(email:string, password:string) =>{
    try{
        const existingVendor  = await db.select().from(vendors).where(eq(vendors.email, email))
        if(!existingVendor.length){
            return{status:404, success:false , message: "Account doesnt exist"}
        }
        const isPasswordValid = await bcrypt.compare(password, existingVendor[0]!.password_hash)
        if(!isPasswordValid){
            return{status:401, success:false, message: "invalid credentials"}
        }
        const { password_hash, ...userData }= existingVendor[0]!

        const token  =accessToken(existingVendor[0]!.id)
        return {status:200, success: true, token, message: "login successful", data: userData}

    }catch (err: any) {
    console.error("Error occurred while logging in vendor:", err.message);
    return { status: 500, success: false, message: err.message };
  }
}