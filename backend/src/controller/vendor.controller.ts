import {createVendor} from "../services/vendor.service.js";

export const CreateVendorController = async(req:any, res:any) => {
    try{
        const vendorData =req.body
        const newVendor = await createVendor(vendorData)
        if(!newVendor.success){
        res.status(newVendor.status).json(newVendor)
        }
        return res.status(newVendor.status).json(newVendor)
    }catch(error){
        return res.status(500).json({status:500,success:false,message: "internal server error"})
    }
}