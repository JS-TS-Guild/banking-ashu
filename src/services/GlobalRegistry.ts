import Bank from "@/models/bank"
import BankAccount from "@/models/bank-account"
import User from "@/models/user"

export default class GlobalRegistry {
    
  private static users : {[userId: number]: User} = {}
  private static banks : {[bankId: number]: Bank} = {}
  private static accounts: {[accoutnId: number] : BankAccount} = {}

  static clear(){
    GlobalRegistry.users = {}
    GlobalRegistry.banks = {}
    GlobalRegistry.accounts = {}
  }

  static getUsers(){
    return GlobalRegistry.users;
  }

  static getUserAccounts(userId: number){
    const user = GlobalRegistry.users[userId];
    return user?.accounts ?? [];
  }

  static addUser(userId: number, user: User){
    GlobalRegistry.users = {...GlobalRegistry.users, [userId]:user}
  }

  static getBanks(){
    return GlobalRegistry.banks;
  }

  static addBank(bankId: number, bank: Bank){
    GlobalRegistry.banks = {...GlobalRegistry.banks , [bankId]: bank}
  }

  static getAllBankAccounts(){
    return GlobalRegistry.accounts;
  }

  static addAccount(accountId: number , account: BankAccount){
    GlobalRegistry.accounts = {...GlobalRegistry.accounts , [accountId]: account}
  }

}