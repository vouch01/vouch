import {createVendor, loginVendor, verifyOtp, generateOtp, passwordReset} from "../services/auth.service.js";

export const CreateVendorController = async(req:any, res:any) => {
    try{
        const vendorData =req.body
        const newVendor = await createVendor(vendorData)
        if(!newVendor.success){
       return res.status(newVendor.status).json(newVendor)
        }
        return res.status(newVendor.status).json(newVendor)
    }catch(error){
        return res.status(500).json({status:500,success:false,message: "internal server error"})
    }
}


export const LoginVendorController = async (req:any , res:any) =>{
    try{
        const {email,password} =req.body
        const newVendor = await loginVendor(email, password)
        if(!newVendor.success){
           return  res.status(newVendor.status).json(newVendor)
        }
        return res.status(newVendor.status).json(newVendor) 
    }catch(error){
        return res.status(500).json({status:500,success:false,message: "internal server error"})
    }
}

export const GenerateOtpController  =async (req:any, res:any) => {
    try{
        const {email} = req.body
        const otp = await generateOtp(email)
        if(!otp.success){
            return res.status(otp.status).json(otp)
        }
        return res.status(otp.status).json(otp)
    }catch(error){
        return res.status(500).json({status:500,success:false,message: "internal server error"})
    }
}

export const VerifyOtpController = async (req:any, res:any) => {
    try{
        const {otp, email} = req.body
        const token  = await verifyOtp(otp, email)
        if(!token.success){
          return res.status(token.status).json(token)
        }
          return res.status(token.status).json(token)
    }catch(error){
        return res.status(500).json({status:500,success:false,message: "internal server error"})
    }
}

export const PasswordResetController = async(req:any, res:any) => {
    try{
        const {password, email} = req.body
        const newPassword = await passwordReset(password, email)
         if(!newPassword.success){
          return res.status(newPassword.status).json(newPassword)
        }
          return res.status(newPassword.status).json(newPassword)
    }catch(error){
        return res.status(500).json({status:500,success:false,message: "internal server error"})
    }
}