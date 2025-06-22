import GlobalRegistry from "@/services/GlobalRegistry";

export default class BankAccount{
  private static idCounter = 0;

  private id: number;
  private amount: number;
  private bankId: number;

  private constructor(amount : number, bank: number){
    this.id = BankAccount.idCounter++;
    this.amount = amount;
    this.bankId = bank;
  }

  static create(amount: number, bankId: number): BankAccount{
    const newAccount = new BankAccount(amount, bankId);
    GlobalRegistry.addAccount(newAccount.getId() , newAccount)
    return newAccount;
  }

  getId(): number{
    return this.id;
  }

  getBalance(): number{
    return this.amount;
  }

  setBalance(amount: number){
    this.amount = amount;
  }

}