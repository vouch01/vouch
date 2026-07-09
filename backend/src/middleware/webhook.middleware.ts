import { generateSignature } from "../utils/webhook.js";
import dotenv from "dotenv";
dotenv.config();

export const verifySignature = async (req:any , res:any , next:any ) =>{
    try{
        const payload= req.body 
        const nombaSignature = req.headers["nomba-signature"]
        const nombaTimestamp = req.headers["nomba-timestamp"]

        const secret= process.env.NOMBA_SECRET!

        const {event_type, requestId,data,} = payload

        const vouchSig = await generateSignature(event_type, secret, requestId, nombaTimestamp, data )

        console.log(`Generated signature [${vouchSig}]`);
        console.log(`Expected signature [${nombaSignature}]`);

        
        if (nombaSignature?.toLowerCase() !== vouchSig?.toLowerCase()) {
  console.warn("Signature mismatch — rejecting webhook")
  return res.status(401).json({ message: "Invalid signature" })
}

        // if (nombaSignature.toLowerCase() === vouchSig!.toLowerCase()) {
        // console.log(">>>>>>> Signatures match <<<<<<<<<<<");
        // } else {
        // console.log("<<<<<<<<< Signatures did not match >>>>>>>>>");
        // }

        next()
    }catch(error){
        console.error('Error verifying signature',error)
        return res.status(500).json({ message: 'internal server error' });
    }
}