import {Redis} from 'ioredis'

export const connection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,  
  enableReadyCheck: false
})

connection.on('error', (err:any) => console.error('Redis error:', err))
connection.on('connect', () => console.log('Redis connected'))