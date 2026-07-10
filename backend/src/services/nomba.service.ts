/**
 * https://api.nomba.com/v1/transfers/banks --fetch bank codes
 * https://api.nomba.com/v2/transfers/bank/{subAccountId} ---account transfer from sub acct
 * https://api.nomba.com/v1/transfers/bank/lookup ---bank account lookup
 * https://api.nomba.com/v1/transactions/requery/{sessionId} --Transaction status requery
 *
 */
import { getValidAccessToken } from "../utils/nomba.js";
import axios from 'axios'

export interface createSubAccountResult {
    bankName:string,
    accountRef:string,
    accountHolderId: string, 
    bankAccountNumber:string,
    expiryDate: string , 
    createdAt: string, 
    bankAccountName:string, 
    code: string,
     description:string
}

interface SubAccountTransferInput{
    amount:number,
    accountNumber:string,
    accountName:string,
    bankCode:string,
    merchantTxRef:string,
    senderName:string,
    narration:string
}
interface SubAccountTransferResult {
  code: string
  description: string
  data:any,
  status:string,
  type:string
}

export const Payment = {
    async lookupBankAccount(vendor_account_number: string, bankCode:string):Promise<{}>{
        const token = await getValidAccessToken()
        const response = await axios.post('https://api.nomba.com/v1/transfers/bank/lookup',{
            accountNumber:vendor_account_number,
            bankCode
        },{
            headers:{
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            accountId: process.env.NOMBA_ACCOUNT_ID
            }
        })

        const { code, description, data } = response.data
  if (code !== '00') {
    throw new Error('Nomba authentication failed')
  }

        const {accountName} = data

        console.log('account name;', accountName)

        return{code, description, accountName } 
    },

    /*
    Creates virtual account for vouch's escrow wallet
    */
  async createVirtualAccountForSubAccount(
    virtual_account_ref: string,
    formattedAmount: number,
    nombaTimeFormat: string,
  ):Promise<createSubAccountResult> {
    const token = await getValidAccessToken()
    const response = await axios.post('https://api.nomba.com/v1/accounts/virtual',{
        accountRef: virtual_account_ref,
        accountName: 'Vouch Escrow',
         currency: 'NGN',
         expectedAmount: formattedAmount,
         expiryDate: nombaTimeFormat
    },{
        headers:{
            Authorization: `Bearer ${token}`,
            accountId: process.env.NOMBA_ACCOUNT_ID,
            subAccountId:process.env.NOMBA_SUB_ACCOUNT_ID,
            'Content-Type': 'application/json'
        },
    })

    const { code, data , description} = response.data

    const {bankName, createdAt, bankAccountName, bankAccountNumber, accountRef, accountHolderId, expiryDate } = data

    return{ bankName,accountRef , accountHolderId, expiryDate , createdAt, bankAccountName,bankAccountNumber, code, description}
  },

  /*
    Transfer Funds from sub account to desired bank
    */

  async  transferFundsFromSubAccountToBank(bankTransferDetails:SubAccountTransferInput):Promise<SubAccountTransferResult> {
    const {
        amount,
        accountNumber,
        accountName,
        bankCode,
    merchantTxRef,
    senderName,
    narration
    }= bankTransferDetails
    const token = await getValidAccessToken()
    const subAccountId = process.env.NOMBA_SUB_ACCOUNT_ID 


    const response = await axios.post(`https://api.nomba.com/v2/transfers/bank/${subAccountId}`,{
        amount,
        accountNumber,
        accountName,
        bankCode,
    merchantTxRef,
    senderName,
    narration
    },{
        headers:{
            Authorization: `Bearer ${token}`,
            accountId: process.env.NOMBA_ACCOUNT_ID,
        },
    })  


    const { code, data, description} = response.data
    const { status, type} =data

    return{ code, data,status, type ,description} 
  },

  /*
    Requeries transaction from sub account 
    */

  async FetchTransactionOnSubAccount():Promise<{}> {
    const token = await getValidAccessToken()
    const subAccountId = process.env.NOMBA_SUB_ACCOUNT_ID 
    const dateFrom = new Date(Date.now() - 15 * 60 * 1000) 
  .toISOString()
  .slice(0, 19) // strips milliseconds and 'Z', to match "yyyy-MM-ddTHH:mm:ss"

const dateTo = new Date().toISOString().slice(0, 19)
    const response = await axios.post(`https://api.nomba.com/v1/transactions/accounts/${subAccountId}?limit=1&dateFrom=${dateFrom}&dateTo=${dateTo}`,{
    },{
        headers:{
            Authorization: `Bearer ${token}`,
            accountId: process.env.NOMBA_ACCOUNT_ID,
        },
    })  

    const { code, data:{results, cursor} , description} = response.data
    

    return{ results, description, code, cursor}
  },

   /*
    Requeries transaction status by sessionID 
    */

  async confirmTransactionStatus(
    sessionId: number,
  ):Promise<{}> {
    const token = await getValidAccessToken()
    const response = await axios.post(`https://api.nomba.com/v1/transactions/requery/${sessionId}`,{
    },{
        headers:{
            Authorization: `Bearer ${token}`,
            accountId: process.env.NOMBA_ACCOUNT_ID,
        },
    })

    const { code, data , description} = response.data

    const {status, amount, type, timeCreated} = data

    return{ status, data, amount, type, timeCreated, description, code}
  }
};
