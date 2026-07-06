import {retrieveVendorById, updateVendorDetails} from '../services/profile.service.js'

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