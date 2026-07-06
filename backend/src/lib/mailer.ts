import dotenv from "dotenv"
dotenv.config()

const RESEND_API_KEY = process.env.RESEND_API_KEY!

export const sendMail = async (to: string, subject: string, html: string) => {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: 'Vouch <onboarding@resend.dev>',
      to,
      subject,
      html
    })
  })

  if (!res.ok) {
    const error = await res.json()
    console.error('Resend failed to send email:', error)
    throw new Error('Failed to send email')
  }

  const data:any = await res.json()
  console.log('Email sent:', data.id)
  return data
}