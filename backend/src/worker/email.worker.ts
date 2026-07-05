import {Worker } from 'bullmq'
import { connection}  from  "../lib/redis.js" 
import {sendPasswordResetOtp} from "../services/mail.service.js"

const emailWorker  = new Worker ('email', async (job) => {
    const {name, email, otp} =job.data

    switch(job.name){
        case 'verification':
        case 'password-reset':
            await sendPasswordResetOtp ({name, email, otp})
            console.log('sendPasswordResetOtp job processed')
            break;
            default:
                throw new Error (`Unknown job type: ${job.name}`)
    }
}, {connection} as any)

emailWorker.on("completed", (job  ) => {
  console.log(`job ${job.id} completed successfully`);
});

emailWorker.on("failed", (job, err) => {
  console.log(`job ${job?.id} failed ${err.message}`);
});

export default emailWorker