export interface User {
  name: string;
  email: string;
  password: string;
}

export interface Address {
  street: string;
  city: string;
  zipCode: string;
}

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  create(userData: User): Promise<void>;
  authenticate(email: string, password: string): Promise<string | null>;
  registerAddress(userId: string, addressData: Address): Promise<void>;
}
