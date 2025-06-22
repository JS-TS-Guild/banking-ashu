import { BankAccountId, UserId } from "@/types/Common"
import BankAccount from "./bank-account"
import GlobalRegistry from "@/services/GlobalRegistry"

export default class Bank {
  private static idCounter = 0

  private id: BankAccountId
  private isNegativeAllowed: boolean
  private accounts: BankAccount[]

  private constructor(isNegativeAllowed: boolean = false) {
    this.id = Bank.idCounter++
    this.isNegativeAllowed = isNegativeAllowed
    this.accounts = []
  }

  static create(
    par: { isNegativeAllowed?: boolean } = { isNegativeAllowed: false }
  ): Bank {
    const newBank = new Bank(par.isNegativeAllowed)
    GlobalRegistry.addBank(newBank.getId(), newBank)
    return newBank
  }

  createAccount(amount: number): BankAccount {
    const newAccount = BankAccount.create(amount, this.id)
    this.accounts.push(newAccount)
    return newAccount
  }

  getId(): number {
    return this.id
  }

  getAccount(accountNumber: number) {
    const account: BankAccount = this.accounts.find(
      (ac) => ac.getId() == accountNumber
    )
    return account
  }

  send(
    senderUserId: UserId,
    recieverUserId: UserId,
    transactionAmount: number,
    recieverBankId?: number
  ) {
    const senderAccounts = GlobalRegistry.getUserAccounts(senderUserId)
    const recieverAccounts = GlobalRegistry.getUserAccounts(recieverUserId)

    const validSenderAccounts = this.accounts.filter((ac) =>
      senderAccounts.includes(ac.getId())
    )

    let validRecieverAccount: BankAccount

    let currenetReciverBalance: number

    if (!recieverBankId) {
      validRecieverAccount = this.accounts.filter((ac) =>
        recieverAccounts.includes(ac.getId())
      )[0]
      currenetReciverBalance = validRecieverAccount.getBalance()
    } else {
      const recieverBank = GlobalRegistry.getBanks()[recieverBankId]

      for( const account of recieverBank.accounts){
        if(recieverAccounts.includes(account.getId())){
          validRecieverAccount = account;
          currenetReciverBalance = account.getBalance();
          break;
        }
      }

    }

    for (const senderAccount of validSenderAccounts) {
      const currentSenderBalance = senderAccount.getBalance()

      if (currentSenderBalance >= transactionAmount) {
        senderAccount.setBalance(currentSenderBalance - transactionAmount)
        validRecieverAccount.setBalance(
          currenetReciverBalance + transactionAmount
        )

        return
      }
    }

    if (this.isNegativeAllowed == false) {
      throw "Insufficient funds"
    }

    const currentSenderBalance = validSenderAccounts[0].getBalance()
    validSenderAccounts[0].setBalance(currentSenderBalance - transactionAmount)
    validRecieverAccount.setBalance(currenetReciverBalance + transactionAmount)
  }
}
