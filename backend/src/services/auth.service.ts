import { accessToken } from "./token.service.js";
import bcrypt from "bcrypt";
import { eq , and , desc, isNull } from "drizzle-orm";
import { db } from "../db/index.js";
import { vendors, orders, webhook_events, otp_tokens } from "../db/schema.js";
import { generateUniqueOtp } from "../utils/uuid.js";
import {sendPasswordResetOtp} from "../services/mail.service.js"
import {emailQueue} from "../lib/queue.js"

interface VendorInputs {
  business_name: string;
  email: string;
  password: string;
}

export const createVendor = async (vendorData: VendorInputs) => {
  try {
    const {
      business_name,
      email,
      password,
    } = vendorData;
    const existingVendor = await db
      .select()
      .from(vendors)
      .where(and(eq(vendors.email, email),isNull(vendors.deleted_at)))
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
      })
      .returning();

    const token = accessToken(newVendor[0]!.id);
    const { password_hash, ...vendor } = newVendor[0]!;

    return {
      status: 201,
      success: true,
      message: ":vendor account created successfully",
      token,
      data: vendor,
    };
  } catch (err: any) {
    console.error("Error occurred while creating vendor:", err.message);
    return { status: 500, success: false, message: err.message };
  }
};

export const loginVendor = async (email: string, password: string) => {
  try {
    const existingVendor = await db
      .select()
      .from(vendors)
      .where(eq(vendors.email, email));
    if (!existingVendor.length) {
      return { status: 404, success: false, message: "Account doesnt exist" };
    }
    const isPasswordValid = await bcrypt.compare(
      password,
      existingVendor[0]!.password_hash,
    );
    if (!isPasswordValid) {
      return { status: 401, success: false, message: "invalid credentials" };
    }
    const { password_hash, ...userData } = existingVendor[0]!;

    const token = accessToken(existingVendor[0]!.id);
    return {
      status: 200,
      success: true,
      token,
      message: "login successful",
      data: userData,
    };
  } catch (err: any) {
    console.error("Error occurred while logging in vendor:", err.message);
    return { status: 500, success: false, message: err.message };
  }
};


export const generateOtp = async (email: string) => {
  try {
    const existingVendor = await db
      .select()
      .from(vendors)
      .where(eq(vendors.email, email));

  if (!existingVendor.length) {
      return { status: 404, success: false, message: "Account doesnt exist" };
    }
    const otp = await generateUniqueOtp(6);
    const name = existingVendor[0]!.business_name
    
    await emailQueue.add('password-reset', {
      name,
      email,
      otp
    })
    console.log('Reset job queued');

    const otpHash = await bcrypt.hash(otp, 10);

    //invalidates old token 
    await db.update(otp_tokens)
  .set({ status: 'USED' })
  .where(eq(otp_tokens.vendor_id, existingVendor[0]!.id))

      await db
      .insert(otp_tokens)
      .values({
        vendor_id: existingVendor[0]!.id,
        otp_token: otpHash,
        expires_at: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
      })
      .returning();

      if (process.env.NODE_ENV === 'test') {
      return { status: 200, success: true, message: "OTP generated successfully", otp }
    }
    return {
      status: 200,
      success: true,
      message: "OTP generated successfully",
    };
  } catch (err: any) {
    console.error("Error occurred while generating OTP:", err.message);
    return { status: 500, success: false, message: err.message };
  }
};



export const verifyOtp = async (otp: string, email: string) => {
  try {
    const vendor = await db
      .select()
      .from(vendors)
      .where(eq(vendors.email, email));
    if (!vendor.length) {
      return { status: 404, success: false, message: "Vendor not found" };
    }
    const vendorId = vendor[0]!.id;

    const existingOtp = await db
      .select()
      .from(otp_tokens)
      .where(and(eq(otp_tokens.vendor_id, vendorId), eq(otp_tokens.status, 'UNUSED')))
      .orderBy(desc(otp_tokens.created_at))
      .limit(1)

    const isOtpValid = await bcrypt.compare(otp, existingOtp[0]!.otp_token!);
    if (!isOtpValid) {
      return { status: 404, success: false, message: "invalid OTP" };
    }
    if (new Date() > existingOtp[0]!.expires_at) {
      return {
        status: 400,
        success: false,
        message: "Token Expired",
      };
    }
    if (existingOtp[0]!.status === "USED") {
      return {
        status: 400,
        success: false,
        message: "Token already used",
      };
    }

    await db
      .update(otp_tokens)
      .set({
        status: "USED",
        verified:true
      })
      .where(eq(otp_tokens.vendor_id, vendorId))
      .returning();

    return {
      status: 200,
      success: true,
      message: "OTP verified successfully",
    };
  } catch (err: any) {
    console.error("Error occurred while verifying OTP:", err.message);
    return { status: 500, success: false, message: err.message };
  }
};



export const passwordReset = async (password: string, email: string) => {
  try {
    const vendor = await db.select().from(vendors).where(eq(vendors.email, email))
    const verifiedOtp = await db.select().from(otp_tokens)
  .where(
    and(
      eq(otp_tokens.vendor_id, vendor[0]!.id),
      eq(otp_tokens.verified, true)
    )
  )

if (!verifiedOtp.length) {
  return { status: 403, success: false, message: 'OTP verification required' }
}
    
    const passwordHash = await bcrypt.hash(password, 10);
 
    const newPassword = await db
      .update(vendors)
      .set({
        password_hash: passwordHash,
      })
      .where(eq(vendors.email, email))
      .returning();

    const token = await accessToken(newPassword[0]!.id);
    //sucessful password reset email
    return {
      status: 200,
      success: true,
      token,
      message: "password reset successfully",
    };
  } catch (err: any) {
    console.error("Error occurred while resetting password:", err.message);
    return { status: 500, success: false, message: err.message };
  }
};
