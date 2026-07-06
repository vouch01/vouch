import {retrieveVendorById} from '../services/profile.service.js'

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