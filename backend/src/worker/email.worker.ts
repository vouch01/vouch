import {Worker } from 'bullmq'
import { connection}  from  "../lib/redis.js" 
import { emailQueue } from '../lib/queue.js' 
import { sendMail } from '../lib/mailer.js'

const emailWorker  = new Worker ('email', async (job) => {
    const {to, subject, html} =job.data

    switch(job.name){
        case 'verification':
        case 'password-reset':
            await sendMail(to, subject, html)
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