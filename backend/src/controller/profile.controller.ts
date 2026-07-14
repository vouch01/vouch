import { handleNombaError } from '../utils/nombaError.js'
import {retrieveVendorById, updateVendorDetails, deleteVendor, verifyBankDetails} from '../services/profile.service.js'

export const RetrieveVendorController = async (req:any, res:any) =>{
    try{
        const id = req.user.id
        const vendor = await retrieveVendorById(id)
        if(!vendor.success){
            return res.status(vendor.status).json(vendor)
        }
        return res.status(vendor.status).json(vendor)
    }catch(error){
        return res.status(500).json({status:500,success:false,message: "internal server error"})
    }
}

export const UpdateDetailsController = async (req:any, res:any) =>{
    try{
        const vendorData = req.body
        const id =req.user.id
        const updatedVendor = await updateVendorDetails(vendorData, id)
        if(!updatedVendor.success){
            return res.status(updatedVendor.status).json(updatedVendor)
        }
           return res.status(updatedVendor.status).json(updatedVendor)
    }catch(error){
        return res.status(500).json({status:500,success:false,message: "internal server error"})
    }
}

export const VerifyBankDetailsController = async (req:any, res:any) =>{
    try{
        const {bankCode, vendor_account_number} = req.body
        const details  = await verifyBankDetails(bankCode,vendor_account_number )
        if(!details.success){
            return res.status(details.status).json(details)
        }
           return res.status(details.status).json(details)
    }catch(err){
        return handleNombaError(err)
    }
}

export const deleteVendorController = async (req:any , res:any)=>{
    try{
        const id = req.user.id
         const vendor = await deleteVendor(id)
        if(!vendor.success){
            return res.status(vendor.status).json(vendor)
        }
           return res.status(vendor.status).json(vendor)
    }catch(error){
        return res.status(500).json({status:500,success:false,message: "internal server error"})
    }
}