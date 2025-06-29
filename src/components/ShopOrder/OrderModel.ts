import { IItem, IOrder, IOrderRequest, IOrderResponse } from "../../types";
import { Events } from "../../utils/constants";
import { Api } from "../base/Api";
import { IEvents } from "../base/EventEmitter";
import { OrderApi } from "./OrderApi";

export class OrderModel {
  protected _shopOrder: IOrder;

  constructor(protected _events: IEvents, protected _api: OrderApi, shopOrder?: IOrder) {
    _events.on(Events.SHOP_ORDER__CHANGED, () => {
      this._shopOrder.total = this.calculateTotal();
    });
    this._shopOrder = shopOrder || { 
      items: [],
      total: 0,
      payment: 'cash',
      email: '',
      phone: '',
      address: ''
    };
  };

  addItem(item: IItem) {
    if (!this._shopOrder.items.map(item => item.id).includes(item.id)) {
      this._shopOrder.items.push(item);
    }
    this._events.emit(Events.SHOP_ORDER__CHANGED);
  }

  removeItem(item: IItem): void {
    if (!this._shopOrder.items.map(item => item.id).includes(item.id)) {
      return;
    }
    this._shopOrder.items = this._shopOrder.items.filter(i => i.id !== item.id);
    this._events.emit(Events.SHOP_ORDER__CHANGED);
  }

  getItemIds(): string[] {
    return this._shopOrder.items.map(item => item.id);
  }
  
  getOrder(): IOrder {
    return this._shopOrder;
  }

  calculateTotal(): number {
    this._shopOrder.total = this._shopOrder.items.reduce((total, item) => {
      return total + item.price;
    }, 0);
    return this._shopOrder.total;
  }

  clearOrder() {
    this._shopOrder.items = [];
    this._shopOrder.total = 0;
    this._events.emit(Events.SHOP_ORDER__CHANGED);
  }

  async submitOrder(): Promise<IOrder> {
    try {
      const response = await this._api.postOrder(this._shopOrder);
      this._shopOrder.total = response.total; // Update total from the response
      return this._shopOrder;
    } catch (error) {
      console.error('Failed to submit order:', error);
      return Promise.reject(error);
    }
  }

  setOrder(order: IOrder) {
    this._shopOrder = order;
    this._events.emit(Events.SHOP_ORDER__CHANGED);
  }

  validateEmail = (email: string): boolean => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  }

  validatePhone = (phone: string): boolean => {
    const phonePattern = /[0-9\+\-\s]{5,15}/g;
    return phonePattern.test(phone);
  }

  validateAddress = (address: string): boolean => {
    const addressPattern = /^.{5,50}$/;
    return addressPattern.test(address);
  }
}