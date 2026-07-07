import  {connection} from './redis.js'
import {Queue} from 'bullmq'

export const emailQueue = new Queue('email', {
    connection: connection as any,
    defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: true,
    removeOnFail: false
  }
})