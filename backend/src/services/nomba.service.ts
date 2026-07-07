/**
 * https://api.nomba.com/v1/transfers/banks --fetch bank codes
 * https://api.nomba.com/v2/transfers/bank/{subAccountId} ---account transfer from sub acct
 * https://api.nomba.com/v1/transfers/bank/lookup ---bank account lookup
 * https://api.nomba.com/v1/transactions/requery/{sessionId} --Transaction status requery
 *
 */
import { getValidAccessToken } from "../utils/nomba.js";
import axios from 'axios'

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
  async createVirtualAccountForSubaccount(
    virtual_account_ref: string,
    expected_amount: number,
    expires_at: Date,
  ):Promise<{}> {
    const token = await getValidAccessToken()
    const response = await axios.post('https://api.nomba.com/v1/accounts/virtual',{
        virtual_account_ref,
        accountName: 'Vouch Escrow',
         currency: 'NGN',
         expectedAmount: expected_amount,
         expiryDate: expires_at
    },{
        headers:{
            Authorization: `Bearer ${token}`,
            accountId: process.env.NOMBA_ACCOUNT_ID,
            subAccountId:process.env.NOMBA_SUB_ACCOUNT_ID,
            'Content-Type': 'application/json'
        },
    })

    const { code, data , description} = response.data

    const {bankName, createdAt, bankAccountName} = data

    return{ bankName, createdAt, bankAccountName, code, description}
  }
};
