import { IProductRepository } from "../IProductRepository";

export class PrismaProductRepository implements IProductRepository {
  findById(id: string): Promise<any> {
    throw new Error("Method not implemented.");
  }
  create(orderData: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  findByUserId(userId: string): Promise<any[]> {
    throw new Error("Method not implemented.");
  }
  delete(orderId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  update(orderId: string, orderData: any): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
