import GlobalRegistry from "@/services/GlobalRegistry";
import { BankAccountId } from "@/types/Common";

export default class User{
  private static idCounter = 0;

  id: number;
  name: string;
  accounts: BankAccountId[]

  private constructor( name: string, account: BankAccountId[] = []) {
    this.id = User.idCounter++;
    this.name = name;
    this.accounts = account;
  }

  static create(name: string, account: BankAccountId[] = []){
    const newUser = new User(name, account);
    GlobalRegistry.addUser(newUser.getId() , newUser)
    return newUser;
  }

  getId() : number{
    return this.id;
  }

  getUserAccounts() : BankAccountId[]{
    return this.accounts;
  }
}