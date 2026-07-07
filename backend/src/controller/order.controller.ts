import { rmdirSync } from "node:fs"
import {createOrder} from "../services/order.service.js"

export const CreateOrderController = async(req:any, res:any) =>{
    try{
        const orderData = req.body
        const vendor_id = req.user.id
        const order = await createOrder(orderData,vendor_id)
        if(!order.success){
            return res.status(order.status).json(order)
        }
        return res.status(order.status).json(order)
    }catch(error){
        return res.status(500).json({status:500,success:false,message: "internal server error"})
    }
}