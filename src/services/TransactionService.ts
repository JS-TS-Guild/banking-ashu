import BankAccount from "@/models/bank-account"

export default class TransactionService {
  static makeTransaction(
    senderBankAccounts: BankAccount[],
    receiverBankAccount: BankAccount,
    transactionAmount: number,
    bankAllowsNegative: boolean
  ) {
    let balanceToBeTransferred = transactionAmount

    for (let i = 0; i <= senderBankAccounts.length; i++) {
      const balanceAmount = senderBankAccounts[i].getBalance()
      let debitAmount = Math.min(balanceToBeTransferred, balanceAmount)

      senderBankAccounts[i].debit(debitAmount)
      balanceToBeTransferred -= debitAmount

      if (balanceToBeTransferred <= 0) break
    }

    if (balanceToBeTransferred > 0) {
      if (bankAllowsNegative)
        senderBankAccounts[0].debit(balanceToBeTransferred)
      else {
        throw new Error("Insufficient funds")
      }
    }

    receiverBankAccount.credit(transactionAmount)
  }
}
