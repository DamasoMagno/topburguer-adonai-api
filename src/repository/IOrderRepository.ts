export interface IOrderRepository {
  findById(id: string): Promise<any>;
  create(orderData: any): Promise<any>;
  findByUserId(userId: string): Promise<any[]>;
  delete(orderId: string): Promise<void>;
  update(orderId: string, orderData: any): Promise<void>;
}
