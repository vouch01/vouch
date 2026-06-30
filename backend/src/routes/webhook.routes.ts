import {Router} from "express"
const router:Router =Router()

router.post("/nomba",function(req:any, res:any){
  const payload = req.body

  console.log('Webhook Received:', JSON.stringify(payload , null , 2));
  res.status(200).json({received: true})
})

export default router;