import dotenv from 'dotenv';
import app from './app.js';
import http from 'http';
import '../src/worker/email.worker.js' 

dotenv.config()

const PORT = process.env.PORT
const  server =http.createServer(app) 

server.listen(PORT , () => {
    console.log(`Server is running on ${PORT}` )
})
