import BankAccount from "@/models/bank-account"
import User from "@/models/user"

export default class TransactionService {
  static makeTransaction(
    senderBankAccounts: BankAccount[],
    receiverBankAccount: BankAccount,
    transactionAmount: number,
    bankAllowsNegative: boolean,
    sender: User
  ) {
    let balanceToBeTransferred = transactionAmount

    for (let i = 0; i < senderBankAccounts.length; i++) {
      const balanceAmount = senderBankAccounts[i].getBalance()
      let debitAmount = Math.min(balanceToBeTransferred, balanceAmount)

      senderBankAccounts[i].debit(debitAmount)
      sender.setAccountsPriority(senderBankAccounts[i].getId())
      balanceToBeTransferred -= debitAmount

      if (balanceToBeTransferred <= 0) break
    }

    if (balanceToBeTransferred > 0) {
      if (bankAllowsNegative) {
        senderBankAccounts[0].debit(balanceToBeTransferred)
        sender.setAccountsPriority(senderBankAccounts[0].getId())
      } else {
        throw new Error("Insufficient funds")
      }
    }

    receiverBankAccount.credit(transactionAmount)
  }
}
