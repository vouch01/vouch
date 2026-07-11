import {createOrder, getAllOrders, getOrderById, deleteOrderById, getOrderAuthPin, generateRiderLink} from "../services/order.service.js"

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

export const GetAllOrderController = async(req:any, res:any) =>{
    try{
        const vendor_id = req.user.id
        const order = await getAllOrders(vendor_id)
        if(!order.success){
            return res.status(order.status).json(order)
        }
        return res.status(order.status).json(order)
    }catch(error){
        return res.status(500).json({status:500,success:false,message: "internal server error"})
    }
}

export const GetOrderByIdController = async(req:any, res:any) =>{
    try{
        const id = req.params.id
        const vendor_id = req.user.id
        const order = await getOrderById(vendor_id, id)
        if(!order.success){
            return res.status(order.status).json(order)
        }
        return res.status(order.status).json(order)
    }catch(error){
        return res.status(500).json({status:500,success:false,message: "internal server error"})
    }
}

export const GetOrderAuthPinController = async(req:any, res:any) =>{
    try{
        const checkoutToken = req.params.checkoutToken
        const pin = await getOrderAuthPin(checkoutToken)
          if(!pin.success){
            return res.status(pin.status).json(pin)
        }
        return res.status(pin.status).json(pin)
    }catch(error){
        return res.status(500).json({status:500,success:false,message: "internal server error"})
    }
}

export const GenerateRiderLinkController = async(req:any, res:any) => {
    try{
         const vendor_id =  req.user.id
        const orderId = req.params.orderId

        const order = await generateRiderLink(orderId, vendor_id)
        if(!order.success){
            return res.status(order.status).json(order)
        }
        return res.status(order.status).json(order)
    }catch(error){
        return res.status(500).json({status:500,success:false,message: "internal server error"})
    }
}
 
export const DeleteOrderById = async(req:any, res:any) =>{
    try{
     const id = req.params.id
    const vendor_id = req.user.id
    const order = await deleteOrderById(vendor_id, id)
        if(!order.success){
            return res.status(order.status).json(order)
        }
        return res.status(order.status).json(order)
    }catch(error){
        return res.status(500).json({status:500,success:false,message: "internal server error"})
    }
}