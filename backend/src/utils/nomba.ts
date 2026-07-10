import axios from 'axios'

let cachedToken:string | null = null
let cachedRefreshToken :string | null = null 
let tokenExpiryTime: number | null = null

async function issueNewToken(): Promise<void> {
     const response = await axios.post('https://api.nomba.com/v1/auth/token/issue', {
    grant_type: 'client_credentials',
    client_id: process.env.NOMBA_CLIENT_ID,
    client_secret: process.env.NOMBA_CLIENT_SECRET
  }, {
    headers: {
        'Content-Type': 'application/json',
         accountId: process.env.NOMBA_ACCOUNT_ID! ,
        }
  })

  const { code, data } = response.data
  if (code !== '00') {
    throw new Error('Nomba authentication failed')
  }


  const { access_token, refresh_token, expiresAt } = data
  cachedToken = access_token
  cachedRefreshToken = refresh_token
  tokenExpiryTime = new Date (expiresAt).getTime()
}

async function refreshToken():Promise<void>{
    const response = await axios.post('https://api.nomba.com/v1/auth/token/refresh', {
        grant_type: "refresh_token",
        refresh_token: cachedRefreshToken
    },{
        headers: {
            Authorization: `Bearer ${cachedToken}`,
            'Content-Type': 'application/json',
            accountId: process.env.NOMBA_ACCOUNT_ID!,
        }
    })

    const { code, data } = response.data
  if (code !== '00') {
    throw new Error('Nomba authentication failed')
  }

    const {access_token, refresh_token, expiresAt} = data
    
    cachedToken= access_token
    cachedRefreshToken= refresh_token
    tokenExpiryTime = new Date (expiresAt).getTime()

}


export async function getValidAccessToken():Promise<string>  {
let currentTime = Date.now()
let bufferTime= 60000

if(cachedToken && tokenExpiryTime && (currentTime + bufferTime < tokenExpiryTime)){ 
return cachedToken;
}

try{
    if(!cachedToken){
        await issueNewToken()
    }else{
        await refreshToken()
    }
    return cachedToken!
}catch(err:any){
     console.error("Critical Failure : Could not authenticate with nomba API", err.message)
     throw new Error ("nomba authentication failed")
}
}


export const nairaToKobo= (nairaAmount:number) => {
    const parsed = typeof nairaAmount === 'string' ? parseFloat(nairaAmount) : nairaAmount;

    if (isNaN(parsed) || parsed< 0) {
        throw new Error("Invalid amount received") ;
    } 
    return Math.round(parsed * 100)
}

export const koboToNombaFormat:any = (koboAmount:number):string => {
    return (koboAmount/100) .toFixed(2)
}

export const formatNombaDate = (date:Date) :string =>{
const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())} ${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}:${pad(date.getUTCSeconds())}`
}