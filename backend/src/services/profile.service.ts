import { eq, and, desc, inArray, isNull } from "drizzle-orm";
import { db } from "../db/index.js";
import { vendors, orders, webhook_events, otp_tokens } from "../db/schema.js";
import {Payment} from "../services/nomba.service.js"
import { handleNombaError } from "../lib/nombaError.js";


interface VendorInputs {
  business_name: string;
  email: string;
  bank_code: string;
  bank_account_number: string;
  bank_account_name: string;
}

export const retrieveVendorById = async (id: string) => {
  try {
    const vendor = await db.query.vendors.findFirst({
      where: and(eq(vendors.id, id), isNull(vendors.deleted_at)),
    });
    if (!vendor) {
      return { status: 404, success: false, message: "vendor not found" };
    }
    const { password_hash, ...safeVendor } = vendor;
    return {
      status: 200,
      success: true,
      message: "Vendor retrieved successfully",
      data: safeVendor,
    };
  } catch (err: any) {
    console.error("Error occurred while retrieving vendor:", err.message);
    return { status: 500, success: false, message: err.message };
  }
};

export const updateVendorDetails = async (
  vendorData: VendorInputs,
  id: string,
) => {
  try {
    const existingVendor = await db.query.vendors.findFirst({
      where: and(eq(vendors.id, id), isNull(vendors.deleted_at)),
    });
    if (!existingVendor) {
      return { status: 404, success: false, message: "vendor not found" };
    }

    //updates provided fields
    const updates = Object.fromEntries(
      Object.entries(vendorData).filter(([_, value]) => value !== undefined),
    );

    if (Object.keys(updates).length === 0) {
      return {
        status: 400,
        success: false,
        message: "No fields provided to update",
      };
    }

    const vendor = await db
      .update(vendors)
      .set(updates)
      .where(eq(vendors.id, id))
      .returning();

    const { password_hash, ...safeVendor } = vendor[0]!;
    return {
      status: 200,
      success: true,
      message: "Vendor details updated successfully",
      data: safeVendor,
    };
  } catch (err: any) {
    console.error("Error occurred while updating vendor details:", err.message);
    return { status: 500, success: false, message: err.message };
  }
};

export const verifyBankDetails = async(bankCode:string, vendor_account_number:string) =>{
  try{
    const details = await Payment.lookupBankAccount(vendor_account_number, bankCode)
    return {
      status: 200,
      success: true,
      message: "Bank account verified successfully",
      data: details
    }
  }catch (err: any){
  console.error("Nomba error", err.message);
    return handleNombaError(err)
  }
}

export const deleteVendor = async (id: string) => {
  try {
    const existingVendor = await db.query.vendors.findFirst({
      where: eq(vendors.id, id),
    });
    if (!existingVendor) {
      return { status: 404, success: false, message: "vendor not found" };
    }

    const activeOrders = await db.query.orders.findFirst({
      where: and(
        eq(orders.vendor_id, id),
        inArray(orders.status, [
          "PENDING_PAYMENT",
          "PAID_IN_ESCROW",
          "DISPATCHED",
        ]),
      ),
    });

    if (activeOrders) {
      return {
        status: 409,
        success: false,
        message: "Cannot delete vendor with active orders",
      };
    }
    await db
      .update(vendors)
      .set({ deleted_at: new Date() })
      .where(eq(vendors.id, id));

    return {
      status: 200,
      success: true,
      message: "Vendor deleted successfully",
    };
  } catch (err: any) {
    console.error("Error occurred while deleting vendor details:", err.message);
    return { status: 500, success: false, message: err.message };
  }
};
