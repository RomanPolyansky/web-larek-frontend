import { IOrder, IOrderRequest, IOrderResponse } from "../../types";
import { Api } from "../base/Api";

export class OrderApi extends Api {
  constructor(baseUrl: string, options: RequestInit = {}) {
    super(baseUrl, options);
  }

  async postOrder(order: IOrder): Promise<IOrderResponse | null> {
      try {
        const request = this.orderToRequest(order);
        const response = await this.post<IOrderResponse>('/api/weblarek/order', request);
        return response;
      } catch (error) {
        console.error('Failed to submit order:', error);
        return Promise.reject(error);
      }
  }

  private orderToRequest(order: IOrder): IOrderRequest {
    return {
      payment: order.payment,
      email: order.email,
      phone: order.phone,
      address: order.address,
      total: order.total,
      items: order.items.map(item => item.id) // Convert items to IDs for the DTO
    };
  }
}