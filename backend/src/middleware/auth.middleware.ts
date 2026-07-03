import jwt from "jsonwebtoken";
const rateLimiter=require('express-rate-limit');
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

export const otpRateLimit = rateLimiter({
windowMs : 30*60*1000,
    max: 4,
    statusCode: 429,
    keyGenerator: (req:any) => req.body.email,
    message :{error : 'Too many request , please try again later'},
      standardHeaders :true,
      legacyHeaders: false
})
