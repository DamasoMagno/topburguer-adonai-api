import { Address, IUserRepository, User } from "../IUserRepository";

export class PrismaUserRepository implements IUserRepository {
  findByEmail(email: string): Promise<User | null> {
    throw new Error("Method not implemented.");
  }
  findById(id: string): Promise<User | null> {
    throw new Error("Method not implemented.");
  }
  create(userData: User): Promise<void> {
    throw new Error("Method not implemented.");
  }
  authenticate(email: string, password: string): Promise<string | null> {
    throw new Error("Method not implemented.");
  }
  registerAddress(userId: string, addressData: Address): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
