import nodemailer from  "nodemailer"
import dotenv from "dotenv"
dotenv.config()


export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GOOGLE_PASSWORD,
  },
   connectionTimeout: 15000,
  tls: {
    rejectUnauthorized: false
  }
});


if (process.env.NODE_ENV !== 'test') {
transporter.verify()
.then(()=>{
    console.log('transporter is ready to send messages')
})
.catch((error:any)=>{
    console.log('transporter failed to send messages', error)
})
}

export const sendMail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: `"Vouch" <${process.env.GMAIL_USER}>`,
    to,
    subject, 
    html
  })
}