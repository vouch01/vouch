import { collectOrderPayment } from "../services/payment.service.js"; 

export const CollectPaymentController = async(req:any, res:any) =>{
    try{
        const checkoutToken= req.params.checkoutToken

        const payment = await collectOrderPayment(checkoutToken)
        if(!payment.success){
            return res.status(payment.status).json(payment)
        }
        return res.status(payment.status).json(payment)
    }catch(error){
        return res.status(500).json({status:500,success:false,message: "internal server error"})
    }
}