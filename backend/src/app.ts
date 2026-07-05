import express from 'express';
import dotenv from 'dotenv';
import routes from "./routes/index.routes.js"
import cors from "cors"

dotenv.config()

const app: express.Application =express()

const allowedOrigins= process.env.ALLOWED_ORIGINS?.split(',')  || []

const corsOptions:any = {
  origin: ( origin:string | undefined , callback: (err :Error | null, allow?:boolean) =>void) =>{
    if(!origin || allowedOrigins.includes(origin)){
      callback(null, true )
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}

app.use(cors(corsOptions))
app.options(/.*/, cors(corsOptions));


app.use(express.json())
app.use(routes)



app.get("/",function(req:any, res:any){
    res.send("this route works")
})


app.get('/health',function(req:any, res:any){
  res.json({ status: 'ok', timestamp: new Date() });
});


export default app