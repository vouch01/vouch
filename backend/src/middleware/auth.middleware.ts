import jwt from "jsonwebtoken";
import rateLimit from 'express-rate-limit';
import dotenv from "dotenv";
dotenv.config();

export const authenticate = (req: any, res: any, next: any) => {
  const token = req.headers["authorization"]?.split(" ")[1] ;
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, unauthorized " });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid token." });
  }
};  

export const otpRateLimit = rateLimit({
windowMs : 60*60*1000,
    max: 4,
    statusCode: 429,
    keyGenerator: (req:any) => req.body.email,
    message :{error : 'Too many request , please try again in 1 hour'},
      standardHeaders :true,
      legacyHeaders: false
})

export const authRateLimit = rateLimit({
windowMs : 15*60*1000,
    max: 5,
    statusCode: 429,
    message :{error : 'Too many request , please try again in 15 minute'},
      standardHeaders :true,
      legacyHeaders: false
})

export const paymentRateLimit = rateLimit({
windowMs : 60*1000,
    max: 10,
    statusCode: 429,
    message :{error : 'Too many request , please try again in 1 minute'},
      standardHeaders :true,
      legacyHeaders: false
})