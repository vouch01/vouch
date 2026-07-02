import crypto from "crypto"

export const generateSignature = async(event_type:string, secret:string , requestId:string, timestamp:string, data:any) =>{
    try{
        const transaction =data.transaction
        const merchant =data.merchant

        const userId = merchant?.userId
        const walletId =merchant?.walletId
        const transactionId =transaction?.transactionId
        const transactionType =transaction?.type
        const transactionTime =transaction?.time
        const eventType =event_type

        let transactionResponseCode =transaction?.responseCode

    const hashingPayload = `${eventType}:${requestId}:${userId}:${walletId}:${transactionId}:${transactionType}:${transactionTime}:${transactionResponseCode}:${timestamp}`;
    
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(hashingPayload)
    const hash = hmac.digest("base64")

    return hash
    }catch(ex:any){
    console.error("Error occurred while generating signature:", ex.message);
    }
}