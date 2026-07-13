console.log('Payment  worker file loaded')

import {Worker } from 'bullmq'
import { connection}  from  "../lib/redis.js" 
import {processOrderPayment, settlePayment} from "../services/payment.service.js"

const paymentWorker  = new Worker ('payment', async (job) => {
  const {bank_account_name,
      bank_account_number,
      bank_code,
      item_name,
      amount} =job.data

    switch(job.name){
      case'payout_confirmation':
      // await settlePayment()
      break;
        case 'settlement':
          await settlePayment(bank_account_name,
      bank_account_number,
      bank_code,
      item_name,
      amount)
      break;
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