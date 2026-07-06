import { eq, and, desc } from "drizzle-orm";
import { db } from "../db/index.js";
import { vendors, orders, webhook_events, otp_tokens } from "../db/schema.js";

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
      where: eq(vendors.id, id),
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
      where: eq(vendors.id, id),
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
