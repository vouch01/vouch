import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'
dotenv.config()

export const  accessToken= (id: string, ) =>{
    const JWT = process.env.JWT_SECRET!
    
    return jwt.sign({id}, JWT, {expiresIn: '1h'})
}
