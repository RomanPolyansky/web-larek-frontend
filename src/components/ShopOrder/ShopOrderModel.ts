import { IShopItem, IShopOrder, IShopOrderDto, IShopOrderResponse } from "../../types";
import { Events } from "../../utils/constants";
import { Api } from "../base/Api";
import { IEvents } from "../base/EventEmitter";

type PaymentType = 'cash' | 'online';

export class ShopOrderModel {
  protected _shopOrder: IShopOrder;

  constructor(protected _events: IEvents, protected api: Api, shopOrder?: IShopOrder) {
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
  }
;

  addItem(item: IShopItem) {
    if (!this._shopOrder.items.includes(item)) {
      this._shopOrder.items.push(item);
    }
    this._events.emit(Events.SHOP_ORDER__CHANGED);
  }

  removeItem(item: IShopItem): void {
    if (!this._shopOrder.items.includes(item)) {
      return;
    }
    this._shopOrder.items = this._shopOrder.items.filter(i => i.id !== item.id);
    this._events.emit(Events.SHOP_ORDER__CHANGED);
  }

  getItemIds(): string[] {
    return this._shopOrder.items.map(item => item.id);
  }

  getItems(): IShopItem[] {
    return this._shopOrder.items;
  }

  getTotalItems(): number {
    return this._shopOrder.items.length;
  }

  setOrder(order: IShopOrder): void {
    this._shopOrder = order;
    this._events.emit(Events.SHOP_ORDER__CHANGED);
  }

  getOrder(): IShopOrder {
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

  async submitOrder(): Promise<IShopOrder> {
    try {
      const dto = {
        ...this._shopOrder,
        items: this._shopOrder.items.map(item => item.id) // Convert items to IDs for the DTO
      }
      const response = await this.api.post<IShopOrderResponse>('/order', dto);
      this._shopOrder.total = response.total; // Update total from the response
      return this._shopOrder;
    } catch (error) {
      console.error('Failed to submit order:', error);
      return Promise.reject(error);
    }
  }
}