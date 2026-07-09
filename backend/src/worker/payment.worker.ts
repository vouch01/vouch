console.log('Payment  worker file loaded')

import {Worker } from 'bullmq'
import { connection}  from  "../lib/redis.js" 
import {processOrderPayment} from "../services/payment.service.js"

const paymentWorker  = new Worker ('email', async (job) => {

    switch(job.name){
        case 'verification':
        case 'process-payment':
            await processOrderPayment(job.data)
            console.log('process-payment job processed')
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