import express from 'express';
import dotenv from 'dotenv';
import routes from "./routes/index.routes.js"
import cors from "cors"

dotenv.config()

const app: express.Application =express()

const allowedOrigins= process.env.ALLOWED_ORIGINS?.split(',')  || []

app.use(cors ({
  origin: allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}))

app.options('*', cors());


app.use(express.json())
app.use(routes)



app.get("/",function(req:any, res:any){
    res.send("this route works")
})


app.get('/health',function(req:any, res:any){
  res.json({ status: 'ok', timestamp: new Date() });
});


export default app