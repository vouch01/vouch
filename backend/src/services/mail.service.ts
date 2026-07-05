import  {sendMail } from "../lib/mailer.js"

interface EmailInput {
    email:string,
    name:string,
    otp:string
}
export const sendEmailVerification = async ({name, email, otp}: EmailInput) =>{
    try{
        await sendMail (
            email,
             'Verify your Vouch account',
            `<h1>Hi ${name}</h1> <p>Your OTP is <strong>${otp}</strong></p>`
        )
        return{
            status: 200,
            success:true,
            message: 'Verification Email Sent successfully' 
        }
    }catch(error){
        console.error('error in sendEmailVerification : ', error)
        return {success:false, message: 'internal server error', error}
    }
}

export const sendPasswordResetOtp = async ({name, email, otp}: EmailInput) =>{
    try{
        await sendMail (
            email,
             'Reset your Vouch account password',
            `<h1>Hi ${name}</h1> <p>Your OTP is <strong>${otp}</strong></p>`
        )
        return{
            status: 200,
            success:true,
            message: 'Verification Email Sent successfully' 
        }
    }catch(error){
        console.error('error in sendEmailVerification : ', error)
        return {success:false, message: 'internal server error', error}
    }
}