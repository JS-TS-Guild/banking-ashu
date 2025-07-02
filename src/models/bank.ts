import { BankAccountId, UserId } from "@/types/Common"
import BankAccount from "./bank-account"
import GlobalRegistry from "@/services/GlobalRegistry"
import User from "./user"
import TransactionService from "@/services/TransactionService"

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
    let allBanks = GlobalRegistry.getBanks()
    let bankAllowsNegative: boolean = this.isNegativeAllowed

    let sender: User = GlobalRegistry.getUserById(senderUserId)
    let senderBankAccounts: BankAccount[] = []
    let senderBankAccountsIds = sender.getUserAccounts()

    let reciever: User = GlobalRegistry.getUserById(recieverUserId)
    let recieverBankAccount: BankAccount
    let recieverBankAccountIds = reciever.getUserAccounts()

    //finding the reciever bank account
    if (recieverBankId) {
      let bank = allBanks[recieverBankId]
      for (let i = 0; i < recieverBankAccountIds.length; i++) {
        let probableAccount = bank.getAccount(recieverBankAccountIds[i])
        if (probableAccount != null) {
          recieverBankAccount = probableAccount
          break
        }
      }
    } else {
      for (const accountId of recieverBankAccountIds) {
        for (const bank of Object.values(allBanks)) {
          const probableAccount = bank.getAccount(accountId)
          if (probableAccount) {
            recieverBankAccount = probableAccount
            break
          }
        }
      }
    }

    //finding the sender accounts

    for (const accountId of senderBankAccountsIds) {
      let account: BankAccount = this.getAccount(accountId)
      if (account) {
        senderBankAccounts.push(account)
      }
    }

    TransactionService.makeTransaction(
      senderBankAccounts,
      recieverBankAccount,
      transactionAmount,
      bankAllowsNegative
    )
  }
}
