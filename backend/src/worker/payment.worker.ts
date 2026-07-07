console.log('Email worker file loaded')

import {Worker } from 'bullmq'
import { connection}  from  "../lib/redis.js" 
import {Payment} from "../services/nomba.service.js"

const paymentWorker  = new Worker ('email', async (job) => {
    const {accountNumber,bankCode, virtual_account_ref, currency, expectedAmount,expiryDate } =job.data

    switch(job.name){
        case 'verification':
        case 'lookup-account':
            await Payment.lookupBankAccount(accountNumber,bankCode )
            console.log('sendPasswordResetOtp job processed')
            break;
            default:
                throw new Error (`Unknown job type: ${job.name}`)
    }
}, {connection} as any)

paymentWorker.on("completed", (job  ) => {
  console.log(`Payment job ${job.id} completed successfully`);
});

paymentWorker.on("failed", (job, err) => {
  console.log(`Payment job ${job?.id} failed ${err.message}`);
});

export default paymentWorker